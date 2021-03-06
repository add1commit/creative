import path from 'path'
import type { Response } from 'express'
import dayjs from 'dayjs'

export const resolve = (arg: string) => path.join(__dirname, arg)

export const composePromise = <T>(...fns: any) => {
  const init = fns.pop()
  return (...arg: string[]) =>
    fns
      .reverse()
      .reduce(
        (sequence: Promise<T>, current: Function) => sequence.then(result => current.call(null, result)),
        Promise.resolve(init.apply(null, arg))
      )
}

export const render = async (res: Response, page: string, options?: object | undefined) => {
  return new Promise((resolve, reject) => {
    res.render(`${page}`, options, (err: Error, html: string) => (err ? reject(err) : resolve(res.send(html))))
  })
}

export const tools = {
  format: (date: string, pattern: string) => dayjs(date).format(pattern)
}
