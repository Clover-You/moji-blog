import fg from 'fast-glob'
import fs from 'fs-extra'
import toml from 'toml'

import { MojiNavbar } from '#/components/navbar'

export async function Header() {
  const [configPath] = await fg('_config.toml')
  const configContent = await fs.readFile(configPath, 'utf-8')
  const { navbar, website } = toml.parse(configContent) as Config

  const items = navbar.items?.map(item => ({ ...item }))

  return <MojiNavbar logo={website.logo} logoText={website.logoText} items={items} />
}
