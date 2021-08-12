import fs from 'fs-extra'
import md2html from 'marked'
import { resolve } from '../utils'

const parser = require('markdown-yaml-metadata-parser')

const usePost = async (path: string) => {
  try {
    path = resolve(`../res/${path}.md`)
    const raw = await fs.readFile(path, { encoding: 'utf-8' })
    if (!raw) throw new Error(`Failed to load post.`)

    const { metadata, content } = await parser(raw)
    const { title, date, tags } = metadata

    const post = md2html(content)

    return {
      title,
      date,
      tags: tags || [],
      content: post,
      raw,
      metadata
    }
  } catch (err) {}
}

export default usePost
