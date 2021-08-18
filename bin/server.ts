import 'module-alias/register'
import App from './app'
import Routes from '../routes'
import { State, Tools } from '../hooks'

require('express-async-errors')

const app = new App({
  port: 3002,
  middleWares: [],
  routes: new Routes(),
  options: { site: State(), ...Tools }
})

app.listen()
