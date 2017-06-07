export function findNoteTitle (value) {
  let splitted = value.split('\n')
  let title = null
  let isInsideCodeBlock = false

  splitted.some((line, index) => {
    let trimmedLine = line.trim()
    let trimmedNextLine = splitted[index + 1] === undefined ? '' : splitted[index + 1].trim()
    if (trimmedLine.match('```')) {
      isInsideCodeBlock = !isInsideCodeBlock
    }
    if (isInsideCodeBlock === false && (trimmedLine.match(/^# +/) || trimmedNextLine.match(/^=+$/))) {
      title = trimmedLine
      return true
    }
  })

  if (title === null) {
    title = ''
    splitted.some((line) => {
      if (line.trim().length > 0) {
        title = line.trim()
        return true
      }
    })
  }

  return title
}

export default {
  findNoteTitle
}
