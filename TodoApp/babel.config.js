export default function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            'react-native/Libraries/Components/Slider/Slider': '@react-native-community/slider',
          },
        },
      ],
    ],
  };
};