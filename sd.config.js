module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      prefix: 'pdl',
      transformGroup: 'css',
      files: [
        {
          destination: 'dist/light.css',
          format: 'css/variables',
          filter: {
            attributes: {
              category: 'light',
            },
          },
        },
        {
          destination: 'dist/dark.css',
          format: 'css/variables',
          filter: {
            attributes: {
              category: 'dark',
            },
          },
        },
        {
          destination: 'dist/base.css',
          format: 'css/variables',
          filter: {
            attributes: {
              category: 'spacing',
            },
          },
        },
        {
          destination: 'dist/comp.css',
          format: 'css/variables',
          filter: {
            attributes: {
              category: 'comp',
            },
          },
        },
      ],
    },
  },
};
