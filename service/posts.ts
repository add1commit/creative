import _ from 'lodash'

export class PostsService {
  private page: number | string

  public list = require('../data/posts.json')

  public paginator = {}

  constructor(page: number | string) {
    this.page = page || 1
  }

  public chunk(size: number = 10) {
    const sort = Number(this.page) - 1 || 0
    const output = _.chunk(this.list, size)
    if (!output[sort]) throw new Error('Oops, please check chunk.')

    this.buildPaginator(output, sort, size, '/page/')

    return output[sort] || []
  }

  public recent(limit: number = 10) {
    return this.list.length <= limit ? this.list : this.list.slice(0, limit)
  }

  public categories() {}
  public category() {}
  public tags() {}
  public tag() {}

  private buildPaginator(data: any[], sort: number, size: number, place: string) {
    const _page = sort + 1
    const hasPre = !!data[sort - 1]
    const hasNext = !!data[_page]

    this.paginator = {
      page: _page,
      next_page: hasNext && _page,
      prev_page: hasPre && sort,
      has_prev: hasPre,
      has_next: hasNext,
      total_count: data.length,
      per_page: size,
      prev_url: hasPre && sort === 1 ? '/' : `${place}${sort}`,
      next_url: hasNext && `${place}${_page + 1}`
    }
  }
}

export default PostsService
