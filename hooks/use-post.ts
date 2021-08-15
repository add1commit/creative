import { Archive } from '../typings/res'
import _ from 'lodash'

export class usePosts {
  private page: number | string

  public list = require('../.data/posts.json')
  public paginator = {}

  constructor(page: number | string) {
    this.page = page || 1
  }
  public chunk(size: number = 10) {
    const index = Number(this.page) - 1 || 0
    const output = _.chunk(this.list, size)
    const hasPre = !!output[index - 1]
    const hasNext = !!output[index + 2]

    this.paginator = {
      page: index + 1,
      next_page: hasNext && index + 2,
      previous_page: hasPre && index - 2,
      has_pre: hasPre,
      has_next: hasNext,
      total_count: output.length,
      per_page: size,
      pre_url: hasPre && `page/${index}`,
      next_url: hasNext && `page/${index + 2}`
    }
    return output[index] || []
  }
  public recent(limit: number = 10) {
    return this.list.length <= limit ? this.list : this.list.slice(0, limit)
  }
  public categories() {}
  public category() {}
  public tags() {}
  public tag() {}
}

export const usePost = async (url: string) => {
  const posts = require('../.data/posts.json')

  const data = posts.find((post: Archive) => post.url === decodeURIComponent(url))

  if (!data) throw new Error(`Failed to load post.`)

  const { metadata, _DATA__, raw } = data
  const { title, date, tags } = metadata

  return {
    title,
    date,
    tags: tags || [],
    content: _DATA__,
    raw,
    metadata
  }
}
