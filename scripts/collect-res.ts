import fs from 'fs-extra'
import md2html from 'marked'
import { Archive, FlattenOutput } from '../typings/res'
import { composePromise, resolve } from '../utils'
import { useSite } from '../hooks'

const extractMetadata = require('markdown-yaml-metadata-parser')

const RES_DIR = resolve('../res')
const DATA_DIR = resolve('../data/')
const COLLECT_SUFFIX = '.json'
const MORE_TAG_REGEX = /<!--.*?more.*-->/g

const readResDir = async () => {
  return await fs.readdir(RES_DIR)
}

const collectMeta = async (dirs: string[], root = RES_DIR): Promise<any> => {
  const site = await useSite()

  return Promise.all(
    dirs
      .filter(dir => dir.endsWith('.md') || !dir.includes('.'))
      .map(async file => {
        const dirPath = `${root}/${file}`
        const isDirectory = fs.statSync(dirPath).isDirectory()

        if (isDirectory) {
          const children = await fs.readdir(dirPath)
          const childrenMetadata = await collectMeta(children, dirPath)
          return { name: file, children: childrenMetadata }
        }

        const raw = await fs.readFile(dirPath, 'utf-8')

        let { metadata, content } = await extractMetadata(raw)

        const matchType = () => (!!root.match(/posts/g) ? 'posts' : 'pages')

        const moreLink = dirPath.replace(RES_DIR, '').replace('/posts/', '/post/').replace('.md', '')

        const isMatchMoreRegex = !!content.match(MORE_TAG_REGEX)

        content = md2html(content)
        if (isMatchMoreRegex) {
          content = content.split(MORE_TAG_REGEX)[0]
          content += `<a href='${moreLink}' id=more-link>${site.posts.label.more}</a>`
        }
        return { type: matchType(), title: metadata.title || file, url: moreLink, metadata, content }
      })
  )
}

const archive = (data: Archive[]) => {
  return data.map(item => {
    if (item.children) {
      item.children = archive(item.children)
      return item
    }

    if (!item.metadata) {
      console.error(`[missing metadata: ${item.name}]`)
      return item
    }

    if (!item.metadata.title) {
      console.error(`[metadata]: missing key "title" in (${item.name}) ${item.url}`)
      console.error('> Please make sure that each post has a [title].')
    }

    if (!item.metadata.date) {
      console.error(`[metadata]: missing key "date" in (${item.name || item.title}) ${item.url}`)
      console.error('> Try to run "new Date().toUTCString()" in console to get "date".')
      const metadata = { ...item.metadata, date: new Date().toUTCString() }
      return { ...item, metadata }
    }
    if (`${new Date(item.metadata.date)}` === 'Invalid Date') {
      console.error(`[metadata]: format error "date" in (${item.name}) ${item.url}`)
      console.error('> Try to run "new Date().toUTCString()" in console to get "date".')
    }
    return item
  })
}

const flatten = async (data: Archive[]): Promise<FlattenOutput> => {
  return Promise.resolve().then(() => {
    let output: FlattenOutput = {
      pages: [],
      posts: []
    }
    const expanded = (children: Archive[]) => {
      if (!children || !children.length) return

      children.forEach((item: any) => {
        if (!item.children) {
          !output[item.type] && (output[item.type] = [])
          output[item.type].push(item)
        }

        expanded(item.children)
      })
    }
    expanded(data)

    return output
  })
}

const sort = async (data: FlattenOutput) => {
  await fs.ensureDir(DATA_DIR)

  Object.keys(data).forEach(async key => {
    data[key] = data[key].sort(
      (pre: Archive, next: Archive) => (+new Date(next.metadata.date) as any) - (new Date(pre.metadata.date) as any)
    )
    await fs.writeJson(`${DATA_DIR}${key}${COLLECT_SUFFIX}`, data[key])
  })
}

;(async () => {
  try {
    const steps = [sort, flatten, archive, collectMeta, readResDir]
    composePromise(...steps)()
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
})()
