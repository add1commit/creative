import express, { Request, Response, Router } from 'express'
import { PostService, PostsService, PageService } from '../service'
import { render } from '../utils'

require('express-async-errors')

class Routes {
  public router: Router = express.Router()

  constructor() {
    this.router.get('/', this.renderMainPage)
    this.router.get('/page/:num', this.renderMainPage)
    this.router.get('/post/:category?/:name', this.renderPostPage)
    this.router.get('/:custom', this.renderCustomPage)
  }

  private renderMainPage = async (req: Request, res: Response) => {
    try {
      const posts = new PostsService(req.params.num)
      await render(res, 'index', { posts })
    } catch (error) {
      res.render('error', { error })
    }
  }

  private renderPostPage = async (req: Request, res: Response) => {
    try {
      const post = await PostService(req.originalUrl)
      await render(res, 'post', { post })
    } catch (error) {
      res.render('error', { error })
    }
  }

  private renderCustomPage = async (req: Request, res: Response) => {
    try {
      const { params, originalUrl } = req
      const page = await PageService(originalUrl)
      await render(res, `${params.custom}`, { page })
    } catch (error) {
      res.render('error', { error })
    }
  }
}

export default new Routes()
