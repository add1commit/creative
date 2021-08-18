export interface StateInterface {
  title: string
  author: string
  description: string
  social?: Object
  theme: ThemeInterface
}

export interface ThemeInterface {
  name: string
  version?: string
}

export interface PostsInterface {
  list: Object | undefined
  recent: () => Promise<void>
  categories: () => Promise<void>
  category: () => Promise<void>
  tags: () => Promise<void>
  tag: () => Promise<void>
}

export interface ToolsInterface {
  format: (date: string, pattern: string) => string
}
