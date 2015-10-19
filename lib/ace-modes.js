var fs = require('fs')
var path = require('path')

var rootUrl = process.cwd()
if (rootUrl === '/') rootUrl = require('remote').require('app').getAppPath()
var url = path.resolve(rootUrl, './submodules/ace/src-min')
console.log(url)

module.exports = fs.readdirSync(url)
  .filter(function (file) {
    return file.match(/^mode-/)
  })
  .map(function (file) {
    var match = file.match(/^mode-([a-z0-9\_]+).js$/)
    return match[1]
  })
