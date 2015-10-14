var fs = require('fs')
var path = require('path')
var url = path.resolve(process.cwd(), './submodules/ace/src-min')

module.exports = fs.readdirSync(url)
  .filter(function (file) {
    return file.match(/^mode-/)
  })
  .map(function (file) {
    var match = file.match(/^mode-([a-z0-9\_]+).js$/)
    return match[1]
  })
