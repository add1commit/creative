import { Props } from '../typings/prop'
import express, { Request, Response, Router } from 'express'
import { usePosts, useSite } from '../hooks'
class Routes {
  public router: Router = express.Router()
  public props: Props | undefined = undefined
  constructor() {
    this.initState()
    this.exec()
  }

  public exec() {
    this.router.get('/', this.renderMainPage)
  }

  public async initState() {
    const site = await useSite()
    const posts = await usePosts()
    this.props = {
      site,
      posts
    }
  }

  private renderMainPage = async (req: Request, res: Response) => {
    res.render('default', this.props)
  }
}

export default Routes
