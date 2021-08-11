import md from 'marked'
import fs from 'fs-extra'
import { Archive } from '../typings/res'

const parser = require('markdown-yaml-metadata-parser')

export const mdParser = async (path: string) => {
  const raw = await fs.readFile(path, { encoding: 'utf-8' })
  const output = await parser(raw)
  const content = md(output.content)
  const { title, date, tags } = output.metadata

  return {
    title,
    date,
    tags: tags || [],
    content,
    raw,
    metadata: output.metadata
  }
}

export const contentParser = async (files: Archive[]) => {
  return Promise.all(
    files.map(post => {
      post.content = md(post.content)
      return post
    })
  )
}
