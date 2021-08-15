import { Site } from '../typings/prop'
import express, { Request, Response, Router } from 'express'
import { usePost, usePosts, useSite } from '../hooks'

require('express-async-errors')

class Routes {
  public router: Router = express.Router()
  public state: Site | undefined = undefined
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
    this.state = await useSite()
  }

  private renderMainPage = async (req: Request, res: Response) => {
    const { num } = req.params

    const site = this.state
    const posts = new usePosts(num)
    console.log(posts.paginator)
    res.render('default', { site, posts })
  }

  private renderPostPage = async (req: Request, res: Response) => {
    try {
      const site = this.state
      const post = await usePost(req.originalUrl)
      res.render('default/post', { site, post })
    } catch (e) {
      res.send(e.message)
    }
  }
}

export default Routes
