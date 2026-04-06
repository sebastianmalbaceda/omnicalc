module.exports = {
  expo: {
    name: 'OmniCalc',
    slug: 'omnicalc',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0A0A0F',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.omnicalc.app',
      buildNumber: '1',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#0A0A0F',
      },
      package: 'com.omnicalc.app',
      versionCode: 1,
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: ['expo-router'],
    extra: {
      eas: {
        projectId: 'your-eas-project-id',
      },
    },
  },
};
