import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react'
import plugin from 'tailwindcss/plugin'
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
  plugins: [nextui(), addDynamicIconSelectors(), plugin(({ matchUtilities, theme }) => {
    matchUtilities(
      {
        'text-shadow': value => ({
          textShadow: value,
        }),
      },
      { values: theme('textShadow') },
    )
  })],
}
export default config
