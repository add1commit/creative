import { Archive } from '../typings/bucket'

const PostService = async (url: string) => {
  const posts = require('../data/posts.json')

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

export default PostService
