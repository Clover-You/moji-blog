import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react'
import { addDynamicIconSelectors } from '@iconify/tailwind'

const config: Config = {
  content: [
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.md',
    '_config.toml',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      screens: {
        lg: '650px',
        xl: '650px',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      prefix: 'moji',
      layout: {
        borderWidth: {
          large: '1px',
          small: '1px',
          medium: '1px',
        },
      },
    }),
    addDynamicIconSelectors(),
  ],
}
export default config
