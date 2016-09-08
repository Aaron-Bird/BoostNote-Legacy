const crypto = require('crypto')
const _ = require('lodash')

module.exports = function (length) {
  if (!_.isFinite(length)) length = 10
  return crypto.randomBytes(length).toString('hex')
}
