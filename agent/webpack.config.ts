import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { useBabelRule, useMinimizerConfigs, useTsRule } from './webpack-mods';
const tsconfig = require('./tsconfig.json');

// ----------------------------------------------------------------------------
// Module Types
// ----------------------------------------------------------------------------
enum BuildMode {
  Production = 'production',
  ProductionDebug = 'production-debug',
  Development = 'development'
}

// ----------------------------------------------------------------------------
// Module Vars
// ----------------------------------------------------------------------------
const mode = process.env.NODE_ENV ?? BuildMode.Development;
const prod = mode === BuildMode.Production;

/**
 * Determines whether source maps should be generated for production bundles. 
 * This will expose raw source code, so it's MUST only be enabled for test builds.
 */
const sourceMapsInProduction = mode === BuildMode.ProductionDebug;

/**
 * Transpile output to support target browsers in package.json => browserslist.
 */
const useBabel = true;

/**
 * Determines whether to enable Babel for development builds. Should only be
 * enabled for testing purposes in order to reduce dev-build time cost.
 */
const useBabelInDevelopment = false;

const config: webpack.Configuration & WebpackDevServer.Configuration = {
  target: 'node',
  entry: {
    bundle: [
      // Note: Paths in the `stylesheets` variable will be added here automatically
      './src/main.ts',
    ],
  },
  resolve: {
    alias: {
      // Note: tsconfig aliases will be loaded automatically.
    },
    extensions: ['.mjs', '.js', '.ts', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  output: {
    publicPath: '/bin/',
    path: __dirname + '/bin',
    filename: 'agent.js',
    chunkFilename: '[name].[id].js',
  },
  module: {
    rules: [
      useTsRule(prod),
    ],
  },
  devServer: {
    hot: true,
    stats: 'minimal',
    contentBase: 'public',
    watchContentBase: true,
    port: 8080,
  },
  mode: (mode === BuildMode.Production || mode === BuildMode.ProductionDebug ? 'production' : 'development'),
  plugins: [
  ],
  optimization: {
    minimizer: [],
  },
  devtool: prod && !sourceMapsInProduction ? false : 'source-map',
};

// ----------------------------------------------------------------------------
// TSConfig 
// Load path mapping from tsconfig as webpack aliases.
// ----------------------------------------------------------------------------
if ('compilerOptions' in tsconfig && 'paths' in tsconfig.compilerOptions) {
  const aliases = tsconfig.compilerOptions.paths;

  for (const alias in aliases) {
    const paths = aliases[alias].map((p: string) => path.resolve(__dirname, p));

    // Our tsconfig uses glob path formats, whereas webpack just wants directories
    // We'll need to transform the glob format into a format acceptable to webpack
    const wpAlias = alias.replace(/(\\|\/)\*$/, '');
    const wpPaths = paths.map((p: string) => p.replace(/(\\|\/)\*$/, ''));

    if (config.resolve && config.resolve.alias) {
      if (!(wpAlias in config.resolve.alias) && wpPaths.length) {
        config.resolve.alias[wpAlias] = wpPaths.length > 1 ? wpPaths : wpPaths[0];
        console.log({ wpAlias, config: config.resolve.alias[wpAlias] });
      }
    }
  }
}

// ----------------------------------------------------------------------------
// Production Config
// These options should only apply to production builds
// ----------------------------------------------------------------------------
if (prod) {
  // Clean the build directory for production builds
  config.plugins?.push(new CleanWebpackPlugin());

  config.optimization?.minimizer?.push(...useMinimizerConfigs(prod, sourceMapsInProduction));
}

// ----------------------------------------------------------------------------
// Babel Config
// ----------------------------------------------------------------------------
if (useBabel && (prod || useBabelInDevelopment)) {
  config.module?.rules.unshift(useBabelRule(prod, sourceMapsInProduction));
}

export default config;