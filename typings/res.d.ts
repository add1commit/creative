export interface Archive {
  name: string
  children: Archive[]
}

export interface Archive {
  type: string
  title: string
  url: string
  metadata: Metadata
  content: string
}

export interface Metadata {
  title: string
  date: string
}

export interface FlattenOutput {
  [key: string]: Archive[]
}
