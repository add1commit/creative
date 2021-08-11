import { PageProps } from '../typings/prop'
import express, { Request, Response, Router } from 'express'

class Routes {
  public path: string = '/'
  public router: Router = express.Router()

  private props: PageProps | undefined

  constructor() {
    this.exec()
  }

  public exec() {
    this.router.get('/', this.mainPage)
  }

  private mainPage = (req: Request, res: Response) => {
    res.render('default', {
      posts: []
    })
  }
}

export default Routes
