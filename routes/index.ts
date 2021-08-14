import { Props } from '../typings/prop'
import express, { Request, Response, Router } from 'express'
import { usePost, usePosts, useSite } from '../hooks'

require('express-async-errors')

class Routes {
  public router: Router = express.Router()
  public props: Props | undefined = undefined
  constructor() {
    this.initState()
    this.exec()
  }

  public exec() {
    this.router.get('/', this.renderMainPage)
    this.router.get('/post/:category?/:name', this.renderPostPage)
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
  try {
    const { site } = this.props!
    const { category, name } = req.params
    const post = await usePost(category, name)
    res.render('default/post', { site, post })
  } catch(e) {
    res.send(e.message)
  }
  }
}

export default Routes
