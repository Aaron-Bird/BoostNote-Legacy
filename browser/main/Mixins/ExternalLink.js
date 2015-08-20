var shell = require('shell')

module.exports = {
  openExternal: function (e) {
    shell.openExternal(e.currentTarget.href)
    e.preventDefault()
  }
}
