/* global localStorage */

var Reflux = require('reflux')

var UserStore = require('./UserStore')

var actions = Reflux.createActions([
  'update',
  'destroy',
  'updateCode',
  'destroyCode',
  'updateNote',
  'destroyNote'
])

function deleteItemFromTargetArray (item, targetArray) {
  targetArray.some(function (_item, index) {
    if (_item.id === item.id) {
      targetArray.splice(index, 1)
      return true
    }
    return false
  })

  return targetArray
}

function updateItemToTargetArray (item, targetArray) {
  var isNew = !targetArray.some(function (_item, index) {
    if (_item.id === item.id) {
      targetArray.splice(index, 1, item)
      return true
    }
    return false
  })

  if (isNew) targetArray.push(item)

  return targetArray
}

module.exports = Reflux.createStore({
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
      currentUser.Planets = updateItemToTargetArray(aPlanet, currentUser.Planets)
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
        team.Planets = updateItemToTargetArray(aPlanet, team.Planets)
      }
    }

    // Update currentUser
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
    UserStore.Actions.update(currentUser)

    // Update the planet
    localStorage.setItem('planet-' + planet.id, JSON.stringify(planet))

    this.trigger({
      status: 'updated',
      data: planet
    })
  },
  onUpdateCode: function (code) {
    code.type = 'code'

    var planet = JSON.parse(localStorage.getItem('planet-' + code.PlanetId))
    if (planet != null) {
      planet.Codes = updateItemToTargetArray(code, planet.Codes)

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
      planet.Codes = deleteItemFromTargetArray(code, planet.Codes)

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
      planet.Notes = updateItemToTargetArray(note, planet.Notes)

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
      planet.Notes = deleteItemFromTargetArray(note, planet.Notes)

      localStorage.setItem('planet-' + note.PlanetId, JSON.stringify(planet))
    }
    note.type = 'note'

    this.trigger({
      status: 'noteDestroyed',
      data: note
    })
  }
})
