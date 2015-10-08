/* global localStorage */

var config = require('../../../config')

var io = require('socket.io-client')(config.apiUrl)

io.on('connected', function (data) {
  console.log('connected by WS')
})

io.on('userUpdated', function (data) {
  console.log('userUpdated')
})

module.exports = {
  io: io
}
