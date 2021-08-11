import path from 'path'
import fs from 'fs-extra'
import { Archive, FlattenOutput } from '../typings/res'
import { composePromise } from '../utils'

const extractMetadata = require('markdown-yaml-metadata-parser')

const resolve = (dir: string) => path.join(__dirname, dir)

const RES_DIR = resolve('../res')
const CACHE_DIR = resolve('../.cache/')
const COLLECT_SUFFIX = '.json'
const MORE_TAG = '<!-- more -->'

const readResDir = async () => {
  return await fs.readdir(RES_DIR)
}

const collectMeta = async (dirs: string[], root = RES_DIR): Promise<any> => {
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

        content = !!content.match(MORE_TAG) ? content.split(MORE_TAG)[0] : content

        const url = dirPath.replace(RES_DIR, '').replace('.md', '')
        return { title: metadata.title || file, url, metadata, content }
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
      console.error(`[metadata]: missing key "date" in (${item.name}) ${item.url}`)
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
          const type = item.url.match(/([^\/]+)/g)[0]
          !output[type] && (output[type] = [])
          output[type].push(item)
        }

        expanded(item.children)
      })
    }
    expanded(data)

    return output
  })
}

const sort = async (data: FlattenOutput) => {
  await fs.ensureDir(CACHE_DIR)

  Object.keys(data).forEach(async key => {
    data[key] = data[key].sort(
      (pre: Archive, next: Archive) => (+new Date(next.metadata.date) as any) - (new Date(pre.metadata.date) as any)
    )
    await fs.writeJson(`${CACHE_DIR}${key}${COLLECT_SUFFIX}`, data[key])
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
