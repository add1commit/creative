import path from 'path'
import { AppProps } from '@/typings/app'
import express, { Application } from 'express'
import { state, tools, resolve } from '../utils'
class App {
  public app: Application
  public port: number = 3000

  constructor(props: AppProps) {
    this.app = express()
    this.port = props.port
    // this.middlewares(props.middleWares)
    this.app.locals = {site: state, ...tools}
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
    this.app.use(express.static('themes'))
  }

  private template() {
    this.app.set('views', resolve('../lib/template'))
    this.app.set('view engine', 'pug')
  }

  public listen() {
    this.app.listen(this.port || process.env.PORT, () => {
      console.log(`Creative app listening on port ${this.port} now!`)
    })
  }
}

export default App
