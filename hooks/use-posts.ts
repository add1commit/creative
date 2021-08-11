import { contentParser } from "../utils/parser"

const usePosts = async () => {
  let posts = require('../.cache/posts.json')
  
  return {
    all: await contentParser(posts),
    recentPosts: async () => {},
    categories: async () => {},
    category: async () => {},
    tags: async () => {},
    tag: async () => {}
  }
}

export default usePosts
