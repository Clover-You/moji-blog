import fg from 'fast-glob'
import fs from 'fs-extra'
import toml from 'toml'

let __CONFIG: Config

export async function initConfig() {
  const [confPath] = await fg('_config.toml')
  const file = await fs.readFile(confPath, 'utf-8')
  __CONFIG = toml.parse(file) as Config
}

type ConfSpace = keyof Config

export async function getConfig<T extends ConfSpace>(space: T) {
  if (!__CONFIG)
    await initConfig()
  return __CONFIG[space]
}
