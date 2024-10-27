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
    wrapper.style.width = '40px';
    wrapper.style.height = '40px';
    wrapper.style.borderRadius = '5px';
    wrapper.style.margin = '10px';
    wrapper.style.border = '1px solid #e3e9f1';
  } else {
    wrapper.style.width = '40px';
    wrapper.style.bottom = '0px';
  }
  wrapper.style.position = 'absolute';
  wrapper.style.left = '0px';
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

  picker.onchange = () => {
    wrapper.style.backgroundColor = picker.value;
    if (titleLink) titleLink.style.color = picker.value;
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
  console.log('cards', cards);
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
}

async function runRootApp(container: HTMLElement) {
  const root = document.createElement('div');
  root.style.marginLeft = '2rem';
  root.style.setProperty('line-height', '1.5');
  root.textContent = 'Tasks for Blackboard';
  root.style.width = '240px';
  root.style.minWidth = '240px';
  root.style.position = 'relative';
  container.append(root);
  runApp(root, BlackboardLMSConfig, await getOptions());
  setColorPickers();
}

export default async function BlackboardEntrypoint() {
  console.log('entry');
  setStyles();
  const container = document.getElementById('site-wrap');
  if (!container) return;
  const observer = new MutationObserver((mutations) => {
    let setRoot = false;
    mutations.forEach((mutationRecord) => {
      //   console.log(mutationRecord);
      mutationRecord.addedNodes.forEach((node) => {
        const nodeElem = node as HTMLElement;
        if (!setRoot && nodeElem.classList) {
          const container = nodeElem.querySelector(
            '.course-columns'
          ) as HTMLElement | null;
          if (!container) return;
          container.style.display = 'flex';
          container.style.gridTemplateColumns = 'repeat(4, minmax(0, 1fr))';
          container.style.alignItems = 'flex-start';
          if (container.children.length) {
            (container.children[0] as HTMLElement).style.flexGrow = '1';
          }
          runRootApp(container);
          setRoot = true;
          //   observer.disconnect();
        }
      });
    });
  });
  observer.observe(container, { subtree: true, childList: true });
}
