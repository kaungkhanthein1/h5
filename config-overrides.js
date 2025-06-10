// config-overrides.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function override(config, env) {
//   if (env === 'production') {
    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.debug'],
          },
        },
      }),
    ];
//   }
  return config;
};
