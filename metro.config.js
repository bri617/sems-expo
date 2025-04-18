// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // Alias the missing-asset-registry-path import
  config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    'missing-asset-registry-path': require.resolve(
      'react-native/Libraries/Image/AssetRegistry'
    ),
  };

  return config;
})();
