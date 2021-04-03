export const useTsRule = (prod: boolean) => ({
  test: /\.ts$/,
  use: 'ts-loader',
  exclude: /node_modules/,
});
