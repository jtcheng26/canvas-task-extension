import { BrightspaceLMSConfig } from '.';
import runApp from '../..';
import { getOptions } from '../../hooks/useOptions';
import {
  colorFromId,
  loadCustomColors,
  setCustomColors,
  StoredCustomColors,
} from '../shared/customColors';

function setStyles() {
  document.documentElement.style.setProperty(
    '--ic-brand-font-color-dark', // used in subtabs and as a default elsewhere
    'rgb(32, 33, 34)'
  );
}

function makeColorPicker(
  callback: (color: string) => void,
  defaultColor: string,
  card: HTMLElement
) {
  const wrapper = document.createElement('wrapper');
  const picker = document.createElement('input');
  wrapper.appendChild(picker);
  picker.type = 'color';
  picker.addEventListener('input', (ev: Event) => {
    callback((ev?.target as HTMLInputElement).value);
  });
  wrapper.style.position = 'absolute';
  wrapper.style.width = '40px';
  wrapper.style.height = '40px';
  wrapper.style.left = '0px';
  wrapper.style.top = '0px';
  wrapper.style.zIndex = '1000';
  wrapper.style.borderRadius = '5px';
  wrapper.style.cursor = 'pointer';
  wrapper.style.margin = '10px';
  wrapper.style.border = '1px solid #e3e9f1';

  picker.style.opacity = '0';
  picker.style.width = '40px';
  picker.style.height = '40px';
  picker.style.cursor = 'pointer';

  picker.value = defaultColor;
  wrapper.style.backgroundColor = picker.value;
  card.style.color = picker.value;

  picker.onchange = () => {
    wrapper.style.backgroundColor = picker.value;
    card.style.color = picker.value;
  };

  card.shadowRoot?.querySelector('.d2l-card-container')?.appendChild(wrapper);

  return wrapper;
}

function setColorPicker(root: HTMLElement, colors: StoredCustomColors) {
  const card = root.shadowRoot?.querySelector('d2l-card') as HTMLElement;
  if (!card) return;
  const hrefObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutationRecord) => {
      if (mutationRecord.attributeName === 'href') {
        const href = (mutationRecord.target as HTMLElement).getAttribute(
          'href'
        );
        if (href) {
          const id = href.split('/').pop();
          if (id) {
            const color = id in colors ? colors[id] : colorFromId(id);
            makeColorPicker(
              (color: string) => {
                setCustomColors('brightspace_custom', { [id]: color });
              },
              color,
              card
            );
            hrefObserver.disconnect();
          }
        }
      }
    });
  });
  hrefObserver.observe(card, { attributes: true });
}

async function setColorPickers() {
  const currColors = await loadCustomColors('brightspace_custom');
  let selector = document.querySelector('d2l-my-courses');
  if (!selector || !selector.shadowRoot) return;
  selector = selector.shadowRoot.querySelector('d2l-my-courses-container');
  if (!selector || !selector.shadowRoot) return;

  // wait for the d2l-enrollment-card elements to load
  const observerGrid = new MutationObserver((mutations) => {
    mutations.forEach((mutationRecord) => {
      mutationRecord.addedNodes.forEach((node) => {
        const htmlNode = node as HTMLElement;
        if (
          htmlNode &&
          htmlNode.classList &&
          htmlNode.classList.contains('course-card-grid')
        ) {
          const cards = htmlNode.querySelectorAll('d2l-enrollment-card');
          cards.forEach((card) =>
            setColorPicker(card as HTMLElement, currColors)
          );
          // don't disconnect, user might switch between 'All' and 'Pinned' tabs
        }
      });
    });
  });

  // wait for the d2l-tabs element to load
  const observerTabs = new MutationObserver((mutations) => {
    mutations.forEach((mutationRecord) => {
      mutationRecord.addedNodes.forEach((node) => {
        if ((node as HTMLElement).tagName === 'D2L-TABS') {
          const htmlNode = node as HTMLElement;
          const content = htmlNode.querySelectorAll('d2l-my-courses-content');
          content.forEach((content) => {
            if (content && content.shadowRoot) {
              const grid = content.shadowRoot.querySelector(
                'd2l-my-courses-card-grid'
              );
              if (grid && grid.shadowRoot) {
                const cards = grid.shadowRoot.querySelectorAll(
                  'd2l-enrollment-card'
                );
                if (!cards.length) {
                  observerGrid.observe(grid.shadowRoot, {
                    childList: true,
                    subtree: true,
                  });
                } else {
                  cards.forEach((card) =>
                    setColorPicker(card as HTMLElement, currColors)
                  );
                }
              }
            }
          });

          observerTabs.disconnect();
        }
      });
    });
  });

  observerTabs.observe(selector.shadowRoot, {
    childList: true,
  });
}

export default async function BrightspaceEntrypoint() {
  const root = document.createElement('div');
  root.style.setProperty('line-height', '1.5');
  root.textContent = 'Tasks for D2L Brightspace';
  root.className = 'd2l-tile d2l-widget';
  setStyles();
  document.querySelector('.homepage-col-4')?.prepend(root);
  runApp(root, BrightspaceLMSConfig, await getOptions());
  setColorPickers();
}
