var fs = require('fs')

module.exports = fs.readdirSync(__dirname + '/../browser/ace/src-min')
  .filter(function (file) {
    return file.match(/^mode-/)
  })
  .map(function (file) {
    var match = file.match(/^mode-([a-z0-9\_]+).js$/)
    return match[1]
  })
