import { getConfig } from '#/core/config'

/**
 * get default theme by config
 * @returns dark | light
 */
export async function getDefaultTheme() {
  const theme = await getConfig('theme')
  return theme.default ?? 'dark'
}
