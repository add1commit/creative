import { AppProps } from '@/typings/app'
import express, { Application } from 'express'
import { tools, resolve } from '../utils'
class App {
  public app: Application
  public port: number = 3000

  constructor(props: AppProps) {
    const state = require('../state.json')
    this.app = express()
    this.port = props.port
    // this.middlewares(props.middleWares)
    this.app.locals = { site: state, ...tools }
    this.routes(props.routes)

    this.assets()
    this.template()
  }

  private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }) {
    middleWares.forEach(middleWare => {
      this.app.use(middleWare)
    })
  }

  private routes(route: any) {
    this.app.use((req, res, next) => {
      console.log(`Accessing ${req.originalUrl} via ${req.method} `)
      next()
    })
    this.app.use('/', route.router)
  }

  private assets() {
    this.app.use(express.static('/template'))
  }

  private template() {
    this.app.set('views', resolve('../template'))
    this.app.set('view engine', 'pug')
  }

  public listen() {
    this.app.listen(this.port || process.env.PORT, () => {
      console.log(`Creative app listening on port ${this.port} now!`)
    })
  }
}

export default App
