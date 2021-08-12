import { Props } from '../typings/prop'
import express, { Request, Response, Router } from 'express'
import { usePost, usePosts, useSite } from '../hooks'
class Routes {
  public router: Router = express.Router()
  public props: Props | undefined = undefined
  constructor() {
    this.initState()
    this.exec()
  }

  public exec() {
    this.router.get('/', this.renderMainPage)
    this.router.get('/posts/*', this.renderPostPage)
  }

  public async initState() {
    const site = await useSite()
    const posts = await usePosts()
    this.props = { site, posts }
  }

  private renderMainPage = async (req: Request, res: Response) => {
    res.render('default', this.props)
  }

  private renderPostPage = async (req: Request, res: Response) => {
    const post = await usePost(req.originalUrl)
    res.render('default/post', { post })
  }
}

export default Routes
