import TerserPlugin from 'terser-webpack-plugin';

export const useMinimizerConfigs = (prod: boolean, sourceMapsInProduction = false) => ([
  // Minify and treeshake JS
  new TerserPlugin({
    sourceMap: sourceMapsInProduction,
    extractComments: false,
  })
]);
