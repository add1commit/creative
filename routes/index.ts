import type { SiteInterface, ToolsInterface } from '../typings/prop'
import express, { Request, Response, Router } from 'express'
import { Post, Posts, Page, State, Tools } from '../hooks'

require('express-async-errors')

class Routes {
  public router: Router = express.Router()

  public state: SiteInterface | undefined = undefined
  public tools: ToolsInterface | undefined = undefined

  constructor() {
    this.initState()
    this.exec()
  }

  public exec() {
    this.router.get('/', this.renderMainPage)
    this.router.get('/page/:num', this.renderMainPage)
    this.router.get('/post/:category?/:name', this.renderPostPage)
    this.router.get('/:custom', this.renderCustomPage)
  }

  public async initState() {
    this.state = await State()
    this.tools = Tools
  }

  private renderMainPage = async (req: Request, res: Response) => {
    const { state: site, tools } = this
    const posts = new Posts(req.params.num)

    res.render('default', { site, posts, ...tools })
  }

  private renderPostPage = async (req: Request, res: Response) => {
    try {
      const { state: site, tools } = this
      const post = await Post(req.originalUrl)

      res.render('default/post', { site, post, ...tools })
    } catch (e) {
      res.send(e.message)
    }
  }

  private renderCustomPage = async (req: Request, res: Response) => {
    try {
      const { params, originalUrl } = req
      const { state: site, tools } = this
      const page = await Page(originalUrl)

      res.render(`default/${params.custom}`, { site, page, ...tools })
    } catch (e) {
      res.send(e.message)
    }
  }
}

export default Routes
