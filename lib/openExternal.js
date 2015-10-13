var shell = require('shell')

export default function (e) {
  shell.openExternal(e.currentTarget.href)
  e.preventDefault()
}
