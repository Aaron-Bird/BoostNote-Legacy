const electron = require('electron')
const shell = electron.shell

export default function (e) {
  shell.openExternal(e.currentTarget.href)
  e.preventDefault()
}
