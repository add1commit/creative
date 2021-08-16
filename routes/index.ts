import type { SiteState } from '../typings/prop'
import express, { Request, Response, Router } from 'express'
import { Post, Posts, State } from '../hooks'

require('express-async-errors')

class Routes {
  public router: Router = express.Router()
  public state: SiteState | undefined = undefined
  constructor() {
    this.initState()
    this.exec()
  }

  public exec() {
    this.router.get('/', this.renderMainPage)
    this.router.get('/page/:num', this.renderMainPage)
    this.router.get('/post/:category?/:name', this.renderPostPage)
  }

  public async initState() {
    this.state = await State()
  }

  private renderMainPage = async (req: Request, res: Response) => {
    const site = this.state
    const posts = new Posts(req.params.num)
    res.render('default', { site, posts})
  }

  private renderPostPage = async (req: Request, res: Response) => {
    try {
      const site = this.state
      const post = await Post(req.originalUrl)
      res.render('default/post', { site, post })
    } catch (e) {
      res.send(e.message)
    }
  }
}

export default Routes
