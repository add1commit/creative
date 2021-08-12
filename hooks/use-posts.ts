const usePosts = async () => {
  let posts = require('../.cache/posts.json')
  
  return {
    all: posts,
    recentPosts: async () => {},
    categories: async () => {},
    category: async () => {},
    tags: async () => {},
    tag: async () => {}
  }
}

export default usePosts
