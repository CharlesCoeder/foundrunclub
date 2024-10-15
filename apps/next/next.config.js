const { withTamagui } = require('@tamagui/next-plugin')
const { join } = require('node:path')

const boolVals = {
  true: true,
  false: false,
}

const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development'

const plugins = [
  withTamagui({
    config: '../../packages/config/src/tamagui.config.ts',
    components: ['tamagui', '@my/ui'],
    appDir: true,
    importsWhitelist: ['constants.js', 'colors.js'],
    outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
    logTimings: true,
    disableExtraction,
    shouldExtract: (path) => {
      if (path.includes(join('packages', 'app'))) {
        return true
      }
    },
    excludeReactNativeWebExports: ['Switch', 'ProgressBar', 'Picker', 'CheckBox', 'Touchable'],
  }),
]

// Extract the Supabase domain from the environment variable
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseDomain = supabaseUrl.match(/^https?:\/\/(.+)$/)?.[1] || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  modularizeImports: {
    '@tamagui/lucide-icons': {
      transform: `@tamagui/lucide-icons/dist/esm/icons/{{kebabCase member}}`,
      skipDefaultConversion: true,
    },
  },
  transpilePackages: [
    'solito',
    'react-native-web',
    'expo-linking',
    'expo-constants',
    'expo-modules-core',
  ],
  experimental: {
    scrollRestoration: true,
  },
  images: {
    domains: supabaseDomain ? [supabaseDomain] : [],
  },
}

module.exports = () => {
  let config = { ...nextConfig }

  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    }
  }

  return config
}
