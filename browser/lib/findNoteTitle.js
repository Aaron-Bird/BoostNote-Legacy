export function findNoteTitle (value) {
  let splitted = value.split('\n')
  let title = null
  let isMarkdownInCode = false

  splitted.some((line, index) => {
    let trimmedLine = line.trim()
    let trimmedNextLine = splitted[index + 1] === undefined ? '' : splitted[index + 1].trim()
    if (trimmedLine.match('```')) {
      isMarkdownInCode = !isMarkdownInCode
    } else if (isMarkdownInCode === false && (trimmedLine.match(/^# +/) || trimmedNextLine.match('='))) {
      if (trimmedNextLine.match('=')) {
        title = trimmedLine.substring(0, trimmedLine.length).trim()
      } else {
        title = trimmedLine.substring(1, trimmedLine.length).trim()
      }
      return true
    }
  })

  if (title == null) {
    for (let i = 0; i < splitted.length; i++) {
      let trimmedLine = splitted[i].trim()
      if (trimmedLine.length > 0) {
        title = trimmedLine
        break
      }
    }
    if (title == null) {
      title = ''
    }
  }

  return title
}

export default {
  findNoteTitle
}
