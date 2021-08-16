import dayjs from 'dayjs'

const Tools = {
  format: (date: string, pattern: string) => {
    return dayjs(date).format(pattern)
  }
}

export default Tools
