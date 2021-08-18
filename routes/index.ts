import type { SiteInterface, ToolsInterface } from '../typings/prop'
import express, { Request, Response, Router } from 'express'
import { Post, Posts, Page } from '../hooks'
import { render } from '../utils'

require('express-async-errors')

class Routes {
  public router: Router = express.Router()

  public state: SiteInterface | undefined = undefined
  public tools: ToolsInterface | undefined = undefined

  constructor() {
    this.router.get('/', this.renderMainPage)
    this.router.get('/page/:num', this.renderMainPage)
    this.router.get('/post/:category?/:name', this.renderPostPage)
    this.router.get('/:custom', this.renderCustomPage)
  }

  private renderMainPage = async (req: Request, res: Response) => {
    try {
      const posts = new Posts(req.params.num)
      await render(res, 'default', { posts })
    } catch (error) {
      res.render('default/error', { error })
    }
  }

  private renderPostPage = async (req: Request, res: Response) => {
    try {
      const post = await Post(req.originalUrl)
      await render(res, 'default/post', { post })
    } catch (error) {
      res.render('default/error', { error })
    }
  }

  private renderCustomPage = async (req: Request, res: Response) => {
    try {
      const { params, originalUrl } = req
      const page = await Page(originalUrl)
      await render(res, `default/${params.custom}`, { page })
    } catch (error) {
      res.render('default/error', { error })
    }
  }
}

export default Routes
