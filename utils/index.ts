import path from 'path'
import type { Response } from 'express'

export const resolve = (dir: string) => path.join(__dirname, dir)

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
    res.render(`${page}`, options, (err, result) => (err ? reject(err) : resolve(result)))
  })
}

