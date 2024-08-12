import StyleDictionary from 'style-dictionary';
import { fileHeader, formattedVariables } from 'style-dictionary/utils';

StyleDictionary.registerFormat({
  name: 'custom/lightHeader',
  format: async function ({ dictionary, file, options }) {
    const { outputReferences, usesDtcg } = options;
    return (
      (await fileHeader({ file })) +
      ':root,\n.force-light {\n' +
      formattedVariables({
        format: 'css',
        dictionary,
        outputReferences,
        usesDtcg,
      }) +
      '\n}\n'
    );
  },
});

StyleDictionary.registerFormat({
  name: 'custom/darkHeader',
  format: async function ({ dictionary, file, options }) {
    const { outputReferences, usesDtcg } = options;
    return (
      (await fileHeader({ file })) +
      ':root.dark,\n.force-dark {\n' +
      formattedVariables({
        format: 'css',
        dictionary,
        outputReferences,
        usesDtcg,
      }) +
      '\n}\n'
    );
  },
});

StyleDictionary.registerFormat({
  name: 'custom/componentColorHeader',
  format: async function ({ dictionary, file, options }) {
    const { outputReferences, usesDtcg } = options;
    return (
      (await fileHeader({ file })) +
      ':root,\n.dark,\n.force-light\n.force-dark {\n' +
      formattedVariables({
        format: 'css',
        dictionary,
        outputReferences,
        usesDtcg,
      }) +
      '\n}\n'
    );
  },
});

// Swap out the fontFamily token used in Figma to the value with the web font stack
StyleDictionary.registerTransform({
  name: 'custom/swapFontFamily',
  type: 'name',
  filter: function (token) {
    if (token.$type === 'fontFamily' && token.filePath.includes('core')) {
      return token;
    }
  },
  transform: function (token) {
    return (token.$value = 'var(--pdl-font-family-web)');
  },
});

const commonOptions = {
  prefix: 'pdl',
  buildPath: 'dist/',
  transformGroup: 'css',
};

function baseConfig() {
  return {
    source: ['tokens/dimension.json'],
    include: ['tokens/core.json'],
    platforms: {
      css: {
        ...commonOptions,
        transforms: ['size/pxToRem', 'custom/swapFontFamily'],
        files: [
          {
            destination: 'pdl-base.css',
            format: 'css/variables',
            filter: async (token) => {
              return token.filePath.includes('dimension');
            },
          },
        ],
      },
    },
  };
}

function componentConfig() {
  return {
    source: ['tokens/comp/*.json'],
    include: ['tokens/**/*.json'],
    platforms: {
      css: {
        ...commonOptions,
        files: [
          {
            destination: 'pdl-components.css',
            format: 'css/variables',
            filter: (token) => token.attributes.category === 'comp' && token.$type !== 'color',
            options: {
              outputReferences: true,
            },
          },
        ],
      },
    },
  };
}

function componentColorConfig() {
  return {
    source: ['tokens/comp/*.json'],
    include: ['tokens/**/*.json'],
    platforms: {
      css: {
        ...commonOptions,
        files: [
          {
            destination: 'pdl-components-color.css',
            format: 'custom/componentColorHeader',
            filter: (token) => token.attributes.category === 'comp' && token.$type === 'color',
            options: {
              outputReferences: true,
            },
          },
        ],
      },
    },
  };
}

function modeConfigs(mode) {
  return {
    source: [`tokens/mode/${mode}.json`],
    include: ['tokens/core.json'],
    platforms: {
      css: {
        ...commonOptions,
        files: [
          {
            destination: `pdl-${mode}.css`,
            format: `custom/${mode}Header`,
            filter: async (token) => {
              return token.filePath.includes(mode);
            },
          },
        ],
      },
    },
  };
}

// Build light.css and dark.css
['light', 'dark'].map(function (mode) {
  const modes = new StyleDictionary(modeConfigs(mode));
  modes.cleanAllPlatforms();
  modes.buildAllPlatforms();
});

// Build base.css
const base = new StyleDictionary(baseConfig());
base.cleanAllPlatforms();
base.buildAllPlatforms();

// Build components.css
const component = new StyleDictionary(componentConfig());
component.cleanAllPlatforms();
component.buildAllPlatforms();

// Build components-color.css
const componentColor = new StyleDictionary(componentColorConfig());
componentColor.cleanAllPlatforms();
componentColor.buildAllPlatforms();
