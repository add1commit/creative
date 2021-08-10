export interface Configuration {
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
