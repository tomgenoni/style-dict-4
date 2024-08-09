import StyleDictionary from 'style-dictionary';

function baseConfig() {
  return {
    source: ['tokens/dimension.json'],
    include: ['tokens/core.json'],
    platforms: {
      css: {
        prefix: 'pdl',
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
            filter: (token) => token.attributes.category === 'comp',
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
        prefix: 'pdl',
        buildPath: 'dist/',
        transformGroup: 'css',
        files: [
          {
            destination: `pdl-${mode}.css`,
            format: 'css/variables',
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
