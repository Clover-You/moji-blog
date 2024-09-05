interface Config {
  website: WebsiteConfig
  theme: ThemeConfig
  navbar: {
    items?: NavbarItem[]
  }
}

interface WebsiteConfig {
  title: string
  subtitle: string
  description: string
  keywords: string[]
  author?: string
  domain: string
  logo: string
  logoText: string
  copyright: string
}

type ThemeMode = 'dark' | 'light'

interface ThemeConfig {
  default: ThemeMode
}

interface NavbarItem {
  url: string
  target?: React.HTMLAttributeAnchorTarget
  iconClass?: string
  textColor?: string
  iconColor?: string
  iconSize?: string
  label?: string
}
