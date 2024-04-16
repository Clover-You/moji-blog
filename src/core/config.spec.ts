import { describe, expect, it } from 'vitest'
import toml from 'toml'
import fg from 'fast-glob'
import fs from 'fs-extra'

describe('config', () => {
  it('read config file', async () => {
    const [configPath] = await fg('_config.toml')
    const configContent = await fs.readFile(configPath, 'utf-8')
    const config = toml.parse(configContent) as Config

    expect(config).toBeTruthy()
  })
})
