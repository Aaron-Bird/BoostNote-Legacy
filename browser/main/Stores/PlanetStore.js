/* global localStorage */

var Reflux = require('reflux')

var UserStore = require('./UserStore')

var Helper = require('../Mixins/Helper')

var actions = Reflux.createActions([
  'update',
  'destroy',
  'updateCode',
  'destroyCode',
  'updateNote',
  'destroyNote'
])

module.exports = Reflux.createStore({
  mixins: [Helper],
  listenables: [actions],
  Actions: actions,
  onUpdate: function (planet) {
    // Copy the planet object
    var aPlanet = Object.assign({}, planet)
    delete aPlanet.Codes
    delete aPlanet.Notes

    // Check if the planet should be updated to currentUser
    var currentUser = JSON.parse(localStorage.getItem('currentUser'))

    var ownedByCurrentUser = currentUser.id === aPlanet.OwnerId

    if (ownedByCurrentUser) {
      currentUser.Planets = this.updateItemToTargetArray(aPlanet, currentUser.Planets)
    }

    if (!ownedByCurrentUser) {
      var team = null
      currentUser.Teams.some(function (_team) {
        if (_team.id === aPlanet.OwnerId) {
          team = _team
          return true
        }
        return
      })

      if (team) {
        team.Planets = this.updateItemToTargetArray(aPlanet, team.Planets)
      }
    }

    // Update currentUser
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
    UserStore.Actions.update(currentUser)

    planet.Codes.forEach(function (code) {
      code.type = 'code'
    })

    planet.Notes.forEach(function (note) {
      note.type = 'note'
    })

    // Update the planet
    localStorage.setItem('planet-' + planet.id, JSON.stringify(planet))

    this.trigger({
      status: 'updated',
      data: planet
    })
  },
  onDestroy: function (planet) {
    // Check if the planet should be updated to currentUser
    var currentUser = JSON.parse(localStorage.getItem('currentUser'))

    var ownedByCurrentUser = currentUser.id === planet.OwnerId

    if (ownedByCurrentUser) {
      currentUser.Planets = this.deleteItemFromTargetArray(planet, currentUser.Planets)
    }

    if (!ownedByCurrentUser) {
      var team = null
      currentUser.Teams.some(function (_team) {
        if (_team.id === planet.OwnerId) {
          team = _team
          return true
        }
        return
      })

      if (team) {
        team.Planets = this.deleteItemFromTargetArray(planet, team.Planets)
      }
    }

    // Update currentUser
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
    UserStore.Actions.update(currentUser)

    // Update the planet
    localStorage.setItem('planet-' + planet.id, JSON.stringify(planet))

    this.trigger({
      status: 'destroyed',
      data: planet
    })
  },
  onUpdateCode: function (code) {
    code.type = 'code'

    var planet = JSON.parse(localStorage.getItem('planet-' + code.PlanetId))
    if (planet != null) {
      planet.Codes = this.updateItemToTargetArray(code, planet.Codes)

      localStorage.setItem('planet-' + code.PlanetId, JSON.stringify(planet))
    }

    this.trigger({
      status: 'codeUpdated',
      data: code
    })
  },
  onDestroyCode: function (code) {
    var planet = JSON.parse(localStorage.getItem('planet-' + code.PlanetId))
    if (planet != null) {
      planet.Codes = this.deleteItemFromTargetArray(code, planet.Codes)

      localStorage.setItem('planet-' + code.PlanetId, JSON.stringify(planet))
    }
    code.type = 'code'

    this.trigger({
      status: 'codeDestroyed',
      data: code
    })
  },
  onUpdateNote: function (note) {
    note.type = 'note'

    var planet = JSON.parse(localStorage.getItem('planet-' + note.PlanetId))
    if (planet != null) {
      planet.Notes = this.updateItemToTargetArray(note, planet.Notes)

      localStorage.setItem('planet-' + note.PlanetId, JSON.stringify(planet))
    }

    this.trigger({
      status: 'noteUpdated',
      data: note
    })
  },
  onDestroyNote: function (note) {
    var planet = JSON.parse(localStorage.getItem('planet-' + note.PlanetId))
    if (planet != null) {
      planet.Notes = this.deleteItemFromTargetArray(note, planet.Notes)

      localStorage.setItem('planet-' + note.PlanetId, JSON.stringify(planet))
    }
    note.type = 'note'

    this.trigger({
      status: 'noteDestroyed',
      data: note
    })
  }
})
