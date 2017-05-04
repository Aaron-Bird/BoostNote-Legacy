export function find (value) {
  let splitted = value.split('\n')
  let title = null
  let isMarkdownInCode = false

  for (let i = 0; i < splitted.length; i++) {
    let trimmedLine = splitted[i].trim()
    if (trimmedLine.match('```')) {
      isMarkdownInCode = !isMarkdownInCode
    } else if (isMarkdownInCode === false && trimmedLine.match(/^# +/)) {
      title = trimmedLine.substring(1, trimmedLine.length).trim()
      break
    }
  }

  if (title == null) {
    title = ''
    for (let i = 0; i < splitted.length; i++) {
      let trimmedLine = splitted[i].trim()
      if (trimmedLine.length > 0) {
        title = trimmedLine
        break
      }
    }
  }

  return title
}

export default {
  find
}
