var crypto = require('crypto')

module.exports = function () {
  var shasum = crypto.createHash('sha1')
  shasum.update(((new Date()).getTime()).toString())
  return shasum.digest('hex')
}
