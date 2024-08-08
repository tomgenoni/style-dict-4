module.exports = {
  source: ['tokens/mode/light.json'],
  include: ['tokens/core.json'],
  platforms: {
    css: {
      prefix: 'pdl',
      transformGroup: 'css',
      files: [
        {
          destination: 'dist/light.css',
          format: 'css/variables',
          filter: async (token) => {
            return token.filePath !== 'tokens/core.json';
          },
        },
      ],
    },
  },
};
