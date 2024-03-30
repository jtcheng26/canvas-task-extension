import runSettings from '../modules/components/dynamic-settings';
import { HOME_WEBSITE } from '../modules/constants';
import { Options } from '../modules/types';
import baseURL from '../modules/utils/baseURL';

export const isInstallSettings =
  baseURL() == HOME_WEBSITE && document.getElementById('tfc-settings');

export async function InstallSettingsEntryPoint(
  options: Options
): Promise<void> {
  const root = document.getElementById('tfc-settings') as ParentNode;
  const settingsRoot = document.createElement('div');
  root.replaceChildren(settingsRoot);
  runSettings(settingsRoot, options);
}
