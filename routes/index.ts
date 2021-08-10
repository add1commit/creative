import { Configuration } from '../typings/config'
import express, { Request, Response, Router } from 'express'
import useConfig from '../utils/use-config'

class Routes {
  public path: string = '/'
  public router: Router = express.Router()
  private config: Configuration | unknown

  constructor() {
    this.initConfiguration()
    this.exec()
  }

  public exec() {
    this.router.get('/', this.page)
  }

  private async initConfiguration() {
    this.config = await useConfig()
  }

  page = (req: Request, res: Response) => {
    res.render('default', { site: this.config })
  }
}

export default Routes
