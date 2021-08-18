import fs from 'fs-extra'
import { composePromise, resolve, state } from '../utils'
import type { StateInterface } from '../typings/prop'

const LIB_DIR = resolve('../lib')
const TEMPLATE_DIR = `${LIB_DIR}/template`

const initDir = async () => {
  await fs.remove(LIB_DIR)
  await fs.ensureDir(LIB_DIR)
}

const fillState = async (state: StateInterface) => {
  const { theme } = state
  const THEME_DIR = resolve(`../themes/${theme.name}`)
  await fs.copy(THEME_DIR, TEMPLATE_DIR)
}

;(async () => {
  try {
    const steps = [fillState, state, initDir]
    composePromise(...steps)()
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
})()
