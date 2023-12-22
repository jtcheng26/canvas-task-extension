module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-dark-mode',
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },

  env: (config) => ({
    ...config,
    DEMO: true,
  }),

  docs: {
    autodocs: true
  }
};
