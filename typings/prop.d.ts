export interface Props {
  site: Site
  posts: Posts
}

export interface Site {
  title: string
  author: string
  description: string
  social?: Object
  theme: Theme
}

export interface Theme {
  name: string
  version?: string
}

export interface Posts {
  all: Object | undefined
  recentPosts: () => Promise<void>
  categories: () => Promise<void>
  category: () => Promise<void>
  tags: () => Promise<void>
  tag: () => Promise<void>
}
