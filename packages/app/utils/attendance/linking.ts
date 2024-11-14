export const linking = {
  prefixes: ['foundrunclub://', 'https://foundrunclub.vercel.app', 'exp://localhost:19000'],
  config: {
    initialRouteName: 'index',
    screens: {
      index: '',
      '(auth)': {
        screens: {
          login: 'login',
          register: 'register',
        },
      },
      '(tabs)': {
        screens: {
          index: 'home',
          profile: 'profile',
          // ... other tab screens
        },
      },
      attendance: 'attendance',
    },
  },
}

export const DEEP_LINK_SCHEMES = {
  PRODUCTION: {
    universal: 'https://foundrunclub.vercel.app',
    scheme: 'foundrunclub://',
  },
  DEVELOPMENT: {
    universal: 'https://foundrunclub.vercel.app',
    scheme: 'foundrunclub://',
  },
}
