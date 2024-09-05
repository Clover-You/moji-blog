import { useTheme } from 'next-themes'

export function useToggleTheme() {
  const { theme, setTheme, systemTheme } = useTheme()

  function toggle() {
    let mode = theme === 'dark' ? 'light' : 'dark'
    if (systemTheme === mode)
      mode = 'system'

    setTheme(mode)
  }

  return { toggle }
}
