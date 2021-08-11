import md from 'marked'
import fs from 'fs-extra'

const mdParser = async (path: string) => {
  const parser = require('markdown-yaml-metadata-parser')
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

export default mdParser
