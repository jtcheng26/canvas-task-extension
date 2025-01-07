import runSettings from '../../components/dynamic-settings';
import { HOME_WEBSITE } from '../../constants';
import { getOptions } from '../../hooks/useOptions';
import baseURL from '../../utils/baseURL';

export const isInstallSettings =
  baseURL() == HOME_WEBSITE && document.getElementById('tfc-settings');

export async function InstallSettingsEntryPoint(): Promise<void> {
  const root = document.getElementById('tfc-settings') as ParentNode;
  const settingsRoot = document.createElement('div');
  root.replaceChildren(settingsRoot);
  runSettings(settingsRoot, await getOptions());
}
