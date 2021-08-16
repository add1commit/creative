import type { SiteState } from '../typings/prop'
import express, { Request, Response, Router } from 'express'
import { Post, Posts, State, Utils } from '../hooks'

require('express-async-errors')

class Routes {
  public router: Router = express.Router()
  public state: SiteState | undefined = undefined
  public utils = {}
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
    this.utils = new Utils()
  }

  private renderMainPage = async (req: Request, res: Response) => {
    const { state: site, utils } = this
    const posts = new Posts(req.params.num)

    res.render('default', { site, posts, ...utils })
  }

  private renderPostPage = async (req: Request, res: Response) => {
    try {
      const { state: site, utils } = this
      const post = await Post(req.originalUrl)

      res.render('default/post', { site, post, ...utils })
    } catch (e) {
      res.send(e.message)
    }
  }
}

export default Routes
