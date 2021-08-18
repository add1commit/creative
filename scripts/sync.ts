import fs from 'fs-extra'
import YAML from 'yaml'
import { composePromise, resolve } from '../utils'

const state = YAML.parse(fs.readFileSync(resolve('../creative.yaml'), { encoding: 'utf-8' }))

const LIB_DIR = resolve('../lib')
const TEMPLATE_DIR = `${LIB_DIR}/template`
const STATE_PATH = `${LIB_DIR}/state.json`

const initDir = async () => {
  await fs.remove(LIB_DIR)
  await fs.ensureDir(LIB_DIR)
}

const fillState = async () => {
  const { theme } = state
  const THEME_DIR = resolve(`../themes/${theme.name}`)
  await fs.writeJSON(STATE_PATH, state)
  await fs.copy(THEME_DIR, TEMPLATE_DIR)
}

;(async () => {
  try {
    const steps = [fillState, initDir]
    composePromise(...steps)()
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
})()
