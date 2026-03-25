module.exports = {
  stories: [
    '../src/**/ev-design-system/StorybookFolders/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-mdx-gfm',
    '@storybook/addon-designs',
    'storybook-addon-pseudo-states',
    // Requires: yarn add -D @storybook/addon-a11y
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  staticDirs: ['../src', '../public'],
  docs: {
    autodocs: true,
  },
  webpackFinal: config => {
    config.plugins.forEach(plugin => {
      if ('ForkTsCheckerWebpackPlugin' === plugin.constructor.name) {
        plugin.memoryLimit = 8192;
      }
    });

    return config;
  },
};
