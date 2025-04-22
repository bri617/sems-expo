// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Tell Metro to look for .cjs files too
  config.resolver.sourceExts.push('cjs');

  return config;
})();
