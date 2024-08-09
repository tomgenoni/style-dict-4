import StyleDictionary from 'style-dictionary';

const base = new StyleDictionary({
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
        },
      ],
    },
  },
});

// const comp = new StyleDictionary({
//   source: ['tokens/dimension.json', 'tokens/core.json', 'tokens/comp/*.json'],
//   platforms: {
//     css: {
//       prefix: 'pdl',
//       buildPath: 'dist/',
//       transformGroup: 'css',
//       files: [
//         {
//           destination: 'pdl-comp.css',
//           format: 'css/variables',
//           filter: (token) => {
//             return token.attributes.category === 'comp';
//           },
//         },
//       ],
//     },
//   },
// });

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

base.buildPlatform('css');
// comp.buildPlatform('css');

['light', 'dark'].map(function (theme) {
  const modes = new StyleDictionary(modeConfigs(theme));
  modes.buildPlatform('css');
});
