var crypto = require('crypto')

module.exports = function () {
  var shasum = crypto.createHash('sha1')
  shasum.update(((new Date()).getTime() + Math.round(Math.random()*1000)).toString())
  return shasum.digest('hex')
}
