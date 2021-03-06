import { Archive } from '../typings/bucket'

const PageService = async (url: string) => {
  const pages = require('../data/pages.json')

  const data = pages.find((page: Archive) => page.url === decodeURIComponent(url))

  if (!data) throw new Error(`Failed to load page.`)

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

export default PageService
