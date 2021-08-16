import _ from 'lodash'

export class Posts {
  private page: number | string

  public list = require('../.data/posts.json')
  public paginator = {}

  constructor( page: number | string) {
    this.page = page || 1
  }
  public chunk(size: number = 10) {
    const index = Number(this.page) - 1 || 0
    const output = _.chunk(this.list, size)
    const hasPre = !!output[index - 1]
    const hasNext = !!output[index + 1]
    this.paginator = {
      page: index + 1,
      next_page: hasNext && index + 1,
      prev_page: hasPre && index,
      has_prev: hasPre,
      has_next: hasNext,
      total_count: output.length,
      per_page: size,
      prev_url: hasPre && index === 1 ? '/' : `/page/${index}`,
      next_url: hasNext && `/page/${index + 2}`
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

export default  Posts

