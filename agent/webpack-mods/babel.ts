import path from 'path';

const rootDir = path.resolve(__dirname, '../');
const sveltePath = path.resolve(rootDir, 'node_modules', 'svelte');

export const useBabelRule = (prod: boolean, sourceMapsInProduction = false) => ({
  test: /\.(?:svelte|m?js)$/,
  include: [path.resolve(rootDir, 'src'), path.dirname(sveltePath)],
  use: {
    loader: 'babel-loader',
    options: {
      sourceType: 'unambiguous',
      presets: ['@babel/preset-env'],
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
});
