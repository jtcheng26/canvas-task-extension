import { BlackboardLMSConfig } from '.';
import runApp from '../..';
import { getOptions } from '../../hooks/useOptions';
import {
  colorFromId,
  loadCustomColors,
  setCustomColors,
} from '../shared/customColors';

function setStyles() {
  document.documentElement.style.setProperty(
    '--ic-brand-font-color-dark', // used in subtabs and as a default elsewhere
    'rgb(32, 33, 34)'
  );
  document.documentElement.style.setProperty(
    '--ic-brand-global-nav-bgd', // used in subtabs and as a default elsewhere
    '#002040'
  );
  document.documentElement.style.setProperty('--ic-brand-primary', '#002040');
}

function makeColorPicker(
  callback: (color: string) => void,
  defaultColor: string,
  card: HTMLElement,
  variant: 'bar' | 'picker' = 'picker'
) {
  const wrapper = document.createElement('wrapper');
  const picker = document.createElement('input');
  wrapper.appendChild(picker);
  picker.type = 'color';
  picker.addEventListener('input', (ev: Event) => {
    callback((ev?.target as HTMLInputElement).value);
  });
  if (variant === 'picker') {
    wrapper.style.width = '20px';
    wrapper.style.height = '20px';
    wrapper.style.borderRadius = '5px';
    wrapper.style.marginTop = '5px';
    wrapper.style.border = '1px solid #e3e9f1';
    wrapper.style.right = '0px';
  } else {
    wrapper.style.width = '40px';
    wrapper.style.bottom = '0px';
    wrapper.style.left = '0px';
  }
  wrapper.style.position = 'absolute';

  wrapper.style.top = '0px';
  wrapper.style.zIndex = '1000';

  wrapper.style.cursor = 'pointer';

  picker.style.opacity = '0';
  picker.style.width = '100%';
  picker.style.height = '100%';

  picker.style.cursor = 'pointer';
  picker.onmouseover = () => {
    wrapper.style.opacity = '0.8';
  };
  picker.onmouseleave = () => {
    wrapper.style.opacity = '1';
  };

  picker.value = defaultColor;
  wrapper.style.backgroundColor = picker.value;
  const titleLink = card.querySelector('h4');
  if (titleLink) titleLink.style.color = picker.value;
  const courseLink = card.querySelector('a');
  if (courseLink) courseLink.style.color = picker.value;

  picker.onchange = () => {
    wrapper.style.backgroundColor = picker.value;
    if (titleLink) titleLink.style.color = picker.value;
    if (courseLink) courseLink.style.color = picker.value;
  };

  card.appendChild(wrapper);
  card.style.position = 'relative';

  const details: HTMLElement | null = card.querySelector('.element-details');
  if (details) details.style.marginLeft = '40px';

  return wrapper;
}

async function setColorPickers() {
  const currColors = await loadCustomColors('blackboard_custom');
  const cards = document.querySelectorAll('bb-base-course-card');
  // const titleNode = cards[0].querySelector('.course-title');
  if (cards.length) {
    cards.forEach((card) => {
      const titleNode = card.querySelector('.course-title');
      if (!titleNode) return;
      // titleNode is initialize with id "course-link-", so wait until the course id is populated
      const observer = new MutationObserver(() => {
        if (titleNode.id.length <= 13) return;
        const courseId = titleNode.id.slice(12);
        const color =
          courseId in currColors ? currColors[courseId] : colorFromId(courseId);
        makeColorPicker(
          (color: string) => {
            setCustomColors('blackboard_custom', { [courseId]: color });
          },
          color,
          card as HTMLElement,
          'bar'
        );
        observer.disconnect();
      });
      observer.observe(titleNode, {
        childList: false,
        subtree: false,
        attributes: true,
        attributeFilter: ['id'],
      });
    });
  } else {
    const container = document.getElementById('My_Courses_Tools');
    if (container) {
      const observer = new MutationObserver(() => {
        const elems = container.querySelectorAll('a');
        elems.forEach((elem) => {
          if (!elem || !elem.parentElement) return;
          const url = new URL(elem.href);
          const courseId = url.searchParams.get('id');
          if (!courseId) return;
          const color =
            courseId in currColors
              ? currColors[courseId]
              : colorFromId(courseId);
          makeColorPicker(
            (color: string) => {
              setCustomColors('blackboard_custom', { [courseId]: color });
            },
            color,
            elem.parentElement,
            'picker'
          );
        });
        if (elems.length) {
          observer.disconnect();
        }
      });
      observer.observe(container, {
        childList: true,
        subtree: true,
      });
    }
  }
}

async function runRootApp(container: HTMLElement, fixedWidth: boolean = true) {
  const root = document.createElement('div');
  root.style.marginLeft = '2rem';
  root.style.setProperty('line-height', '1.5');
  root.textContent = 'Tasks for Blackboard';
  if (fixedWidth) {
    root.style.width = '240px';
    root.style.minWidth = '240px';
  } else {
    root.style.width = '100%';
  }
  root.style.position = 'relative';
  container.append(root);
  const options = await getOptions();
  if (!options.sidebar) {
    const mytasks = document.getElementById('My_Tasks_Tools');
    if (mytasks && mytasks.parentElement) {
      mytasks.parentElement.style.display = 'none';
    }
  }

  runApp(root, BlackboardLMSConfig, options);
  setColorPickers();
}

export default async function BlackboardEntrypoint() {
  setStyles();
  const container = document.getElementById('site-wrap');
  if (!container) {
    OldBlackboardEntrypoint();
    return;
  }
  // course page
  const observer = new MutationObserver((mutations) => {
    let setRoot = false;
    mutations.forEach((mutationRecord) => {
      mutationRecord.addedNodes.forEach((node) => {
        const nodeElem = node as HTMLElement;
        if (!setRoot && nodeElem.querySelector) {
          let container = nodeElem.querySelector(
            '.course-columns'
          ) as HTMLElement | null;
          if (!container) {
            if (nodeElem.id === 'activity-stream') container = nodeElem;
            else {
              container = nodeElem.querySelector(
                '#activity-stream'
              ) as HTMLElement | null;
              if (!container) return;
              container = container.parentElement;
              if (!container) return;
            }
            container.style.paddingRight = '20px';
          }
          container.style.display = 'flex';
          container.style.gridTemplateColumns = 'repeat(4, minmax(0, 1fr))';
          container.style.alignItems = 'flex-start';
          if (container.children.length) {
            (container.children[0] as HTMLElement).style.flexGrow = '1';
          }
          runRootApp(container);
          setRoot = true;
          // don't disconnect observer since user may switch between tabs (courses and activity)
        }
      });
    });
  });
  observer.observe(container, { subtree: true, childList: true });
}

// for non-ultra blackboard
async function OldBlackboardEntrypoint() {
  const container = document.getElementById('column2');
  if (!container) return;
  const portlet = document.createElement('div');
  portlet.className = 'portlet clearfix reorderableModule';
  portlet.style.display = 'flex';
  portlet.style.justifyContent = 'center';
  portlet.style.alignItems = 'center';
  portlet.style.paddingTop = '2rem';
  portlet.style.paddingRight = '2rem'; // offset the default padding from runRootApp
  if (container.children.length) {
    container.insertBefore(portlet, container.children[0]);
  } else {
    container.appendChild(portlet);
  }
  runRootApp(portlet, false);
}
