import dayjs from 'dayjs'

class Utils {
  constructor() {}

  public format(date: string, pattern: string) {
    return dayjs(date).format(pattern)
  }
}

export default Utils
