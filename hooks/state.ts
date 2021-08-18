import fs from 'fs-extra'
import YAML from 'yaml'
import path from 'path'

export const resolve = (...paths: string[]) => path.join(...paths)

const CONFIG_DIR = resolve(__dirname, '../creative.yaml')

const State = () => {
  try {
    const output = fs.readFileSync(CONFIG_DIR, { encoding: 'utf-8' })
    return YAML.parse(output)
  } catch (error) {
    throw new Error('Unable to load config file')
  }
}

export default State
