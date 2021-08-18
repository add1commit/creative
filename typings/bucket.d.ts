export interface Archive {
  name: string
  children: Archive[]
}

export interface Archive {
  type: string
  title: string
  date: string
  url: string
  metadata: Metadata
  content: string
  _DATA__: string
  raw: string
}

export interface Metadata {
  title: string
  date: string
}

export interface FlattenOutput {
  [key: string]: Archive[]
}
