import { BrightspaceLMSConfig } from '.';
import runApp from '../..';
import { getOptions } from '../../hooks/useOptions';

function setStyles() {
  document.documentElement.style.setProperty(
    '--ic-brand-font-color-dark', // used in subtabs and as a default elsewhere
    'rgb(32, 33, 34)'
  );
}

export default async function BrightspaceEntrypoint() {
  const root = document.createElement('div');
  root.style.setProperty('line-height', '1.5');
  root.textContent = 'Tasks for D2L Brightspace';
  root.className = 'd2l-tile d2l-widget';
  setStyles();
  document.querySelector('.homepage-col-4')?.prepend(root);
  runApp(root, BrightspaceLMSConfig, await getOptions());
}
