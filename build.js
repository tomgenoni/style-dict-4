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
            filter: (token) => {
              return token.attributes.category === 'dimension';
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

function modeConfigs(theme) {
  return {
    source: [`tokens/mode/${theme}.json`],
    include: ['tokens/core.json'],
    platforms: {
      css: {
        prefix: 'pdl',
        buildPath: 'dist/',
        transformGroup: 'css',
        files: [
          {
            destination: `pdl-${theme}.css`,
            format: 'css/variables',
            filter: async (token) => {
              return token.filePath.includes(theme);
            },
          },
        ],
      },
    },
  };
}

const base = new StyleDictionary(baseConfig());
base.buildPlatform('css');

const comp = new StyleDictionary(compConfig());
comp.buildPlatform('css');

['light', 'dark'].map(function (theme) {
  const modes = new StyleDictionary(modeConfigs(theme));
  modes.buildPlatform('css');
});
