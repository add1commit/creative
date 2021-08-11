import path from 'path'

export const resolve = (...paths: string[]) => path.join(...paths)

export function composePromise<T>(...fns: any) {
  const init = fns.pop()
  return (...arg: string[]) =>
    fns
      .reverse()
      .reduce(
        (sequence: Promise<T>, current: Function) => sequence.then(result => current.call(null, result)),
        Promise.resolve(init.apply(null, arg))
      )
}
