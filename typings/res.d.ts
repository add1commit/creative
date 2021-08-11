export interface Archive {
  name: string
  children: Archive[]
}

export interface Archive {
  name: string
  url: string
  metadata: Metadata
}

export interface Metadata {
  title: string
  date: string
}

export interface FlattenOutput {
  [key: string]: Archive[]
}
