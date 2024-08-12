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
  name: 'custom/compColorHeader',
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

function baseConfig() {
  return {
    source: ['tokens/dimension.json'],
    include: ['tokens/core.json'],
    platforms: {
      css: {
        prefix: 'pdl',
        transforms: ['size/pxToRem', 'custom/swapFontFamily'],
        buildPath: 'dist/',
        transformGroup: 'css',
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

function compConfig() {
  return {
    source: ['tokens/comp/*.json'],
    include: ['tokens/**/*.json'],
    platforms: {
      css: {
        prefix: 'pdl',
        buildPath: 'dist/',
        transformGroup: 'css',
        files: [
          {
            destination: 'pdl-comp.css',
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

function compColorConfig() {
  return {
    source: ['tokens/comp/*.json'],
    include: ['tokens/**/*.json'],
    platforms: {
      css: {
        prefix: 'pdl',
        buildPath: 'dist/',
        transformGroup: 'css',
        files: [
          {
            destination: 'pdl-comp-color.css',
            format: 'custom/compColorHeader',
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
  const modeFormat = mode === 'light' ? 'custom/lightHeader' : 'custom/darkHeader';
  console.log(modeFormat);

  return {
    source: [`tokens/mode/${mode}.json`],
    include: ['tokens/core.json'],
    platforms: {
      css: {
        prefix: 'pdl',
        buildPath: 'dist/',
        transformGroup: 'css',
        files: [
          {
            destination: `pdl-${mode}.css`,
            format: modeFormat,
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
  modes.buildPlatform('css');
});

// Build base.css
const base = new StyleDictionary(baseConfig());
base.buildPlatform('css');

// Build comp.css
const comp = new StyleDictionary(compConfig());
comp.buildPlatform('css');

// Build comp-color.css
const compColor = new StyleDictionary(compColorConfig());
compColor.buildPlatform('css');
