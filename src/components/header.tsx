import { MojiNavbar } from '#/components/navbar'
import { getConfig } from '#/core/config'

export async function Header() {
  const navbar = await getConfig('navbar')
  const website = await getConfig('website')

  const items = navbar.items?.map(item => ({ ...item }))

  return <MojiNavbar logo={website.logo} logoText={website.logoText} items={items} />
}
