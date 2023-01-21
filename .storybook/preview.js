import './styles.css';
import '@storybook/addon-console';
import { themes } from '@storybook/theming';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    // Override the default dark theme
    dark: { ...themes.dark, appBg: 'black', appContentBg: 'rgb(22, 22, 22)' },
    // Override the default light theme
    light: { ...themes.normal, appBg: 'white' },
  },
};
