import 'module-alias/register'
import App from './app'
import route from './routes'

require('express-async-errors')

const app = new App({
  port: 6000,
  middleWares: [],
  routes: route,
})

app.listen()
