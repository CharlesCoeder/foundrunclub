export const linking = {
  prefixes: ['foundrunclub://', 'https://foundrunclub.vercel.app', 'exp://localhost:19000'],
  config: {
    screens: {
      attendance: {
        path: 'attendance',
        parse: {
          data: (data: string) => data,
        },
      },
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
