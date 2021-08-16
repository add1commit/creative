import 'module-alias/register'
import App from './app'
import Routes from '../routes'

require('express-async-errors')

const app = new App({
  port: 3000,
  middleWares: [],
  routes: new Routes()
})

app.listen()
