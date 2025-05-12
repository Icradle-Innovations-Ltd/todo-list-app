// Support for both CommonJS and ES modules
const config = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};

// CommonJS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}

// ES module export
export default config;