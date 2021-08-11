const path = require('path')
const fs = require('fs-extra')
const extractMetadata = require('markdown-yaml-metadata-parser')

const resolve = dir => path.join(__dirname, dir)

const RES_DIR = resolve('../../res')
const CACHE_DIR = resolve('../../.cache')
const COLLECT_SUFFIX = '.json'

const collectMeta = async (dirs, root = RES_DIR) => {
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

        const content = await fs.readFile(dirPath, 'utf-8')
        const { metadata } = await extractMetadata(content)
        const url = dirPath.replace(RES_DIR, '').replace('.md', '')
        return { name: metadata.title || file, url, metadata }
      })
  )
}

const archive = data => {
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

const flatten = async archive => {
  const output = []
  const expanded = children => {
    if (!children || !children.length) return
    children.forEach(e => {
      if (!e.children) {
        const type = e.url.match(/([^\/]+)/g)[0]
        output.push({ type, ...e })
      }
      expanded(e.children)
    })
  }
  expanded(archive)
  return output
}

;(async () => {
  const res = await fs.readdir(RES_DIR)
  const metaData = await collectMeta(res)
  const archiveData = await archive(metaData)
  const flattenData = await flatten(archiveData)
  console.log(flattenData)
})()
