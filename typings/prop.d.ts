export interface PageProps {
  site: Site
  posts: Function
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
