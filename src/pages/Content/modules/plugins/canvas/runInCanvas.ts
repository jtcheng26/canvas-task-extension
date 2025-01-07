import { CanvasLMSConfig } from '.';
import runApp from '../..';
import { getOptions } from '../../hooks/useOptions';
import { Options } from '../../types';

/* Standardizes school-specific CSS class choices so the sidebar works/looks right. */
function prepareCanvasStyles() {
  /* Ensures that there is no max-width, so sidebar stays at right side on large screens. */
  document.body.classList.add('full-width');
}

function runAppUsingOptions(container: HTMLElement, data: Options) {
  /*
      insert new div at top of sidebar to hold content
    */
  const newContainer = document.createElement('div');
  newContainer.id = 'tfc-wall-rose';
  (container.parentNode as Node).insertBefore(newContainer, container);
  /*
      only visually hide sidebar to prevent issues with DOM modification
    */
  if (!data.sidebar) {
    (document.getElementById('right-side') as HTMLElement).className +=
      ' hidden-sidebar';
  }

  runApp(newContainer, CanvasLMSConfig, data);
}

async function runAppInChrome(container: HTMLElement) {
  runAppUsingOptions(container, await getOptions());
}

/* Chrome APIs work fine in firefox currently, but firefox-native implementation is saved here for the future. */
function runAppInFirefox(container: HTMLElement) {
  // (async () => {
  //   // @ts-expect-error: InstallTrigger is only in Firefox
  //   const options = await browser.storage.sync.get(storedUserOptions);
  //   // @ts-expect-error: InstallTrigger is only in Firefox
  //   browser.storage.sync.set(optionsOrDefaults(options as Options));
  //   // @ts-expect-error: InstallTrigger is only in Firefox
  //   const updatedOptions = await browser.storage.sync.get(null);
  //   runAppUsingOptions(container, updatedOptions);
  // })();
  runAppInChrome(container);
}

let sidebarLoaded = false;

export function createSidebar(
  container: HTMLElement,
  observer?: MutationObserver
): void {
  prepareCanvasStyles();
  observer?.disconnect();
  /* IMPORTANT: Only load sidebar once when switching between list view and other views */
  if (!sidebarLoaded) {
    sidebarLoaded = true;
    // // @ts-expect-error: InstallTrigger is a firefox global
    const isFirefox = false; // typeof InstallTrigger !== 'undefined'

    const outerWall = document.createElement('div');
    outerWall.id = 'tfc-wall-maria';
    container.parentElement?.insertBefore(outerWall, container);

    if (isFirefox) runAppInFirefox(outerWall);
    else runAppInChrome(outerWall);
  }
}
