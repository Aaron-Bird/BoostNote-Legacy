/* global localStorage */

var config = require('../../../config')
var UserStore = require('../Stores/UserStore')
var PlanetStore = require('../Stores/PlanetStore')

var io = require('socket.io-client')(config.apiUrl)

io.on('connected', function (data) {
  console.log('connected by WS')
  reconnect()
})

io.on('userUpdated', function (data) {
  console.log('userUpdated')
  UserStore.Actions.update(data)
})

// Planet
io.on('planetUpdated', function (data) {
  console.log('planetUpdated')
  PlanetStore.Actions.update(data)
})

io.on('planetDestroyed', function (data) {
  console.log('planetDestroyed')
  PlanetStore.Actions.destroy(data)
})

// Article
io.on('codeUpdated', function (data) {
  console.log('codeUpdated')
  PlanetStore.Actions.updateCode(data)
})
io.on('codeDestroyed', function (data) {
  console.log('codeDestroyed')
  PlanetStore.Actions.destroyCode(data)
})
io.on('noteUpdated', function (data) {
  console.log('noteUpdated')
  PlanetStore.Actions.updateNote(data)
})
io.on('noteDestroyed', function (data) {
  console.log('noteDestroyed')
  PlanetStore.Actions.destroyNote(data)
})

var reconnect = function (currentUser) {
  if (currentUser == null) currentUser = JSON.parse(localStorage.getItem('currentUser'))
  if (currentUser != null) {
    var rooms = ['user:' + currentUser.id].concat(currentUser.Teams.map(function (team) {
      return 'user:' + team.id
    }))

    io.emit('room:sync', {rooms: rooms})
  } else {
    io.emit('room:sync', {rooms: []})
  }
}

module.exports = {
  io: io,
  reconnect: reconnect
}
