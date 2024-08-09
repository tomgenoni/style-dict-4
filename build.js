import StyleDictionary from 'style-dictionary';

function modeConfigs(theme) {
  return {
    source: [`tokens/mode/${theme}.json`],
    include: ['tokens/core.json'],
    platforms: {
      css: {
        prefix: 'pdl',
        transformGroup: 'css',
        files: [
          {
            destination: `dist/${theme}.css`,
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

['light', 'dark'].map(function (theme) {
  const sd = new StyleDictionary(modeConfigs(theme));
  sd.buildPlatform('css');
});
