/* global localStorage */

var Reflux = require('reflux')

var actions = Reflux.createActions([
  'updatePlanet',
  'destroyPlanet',
  'updateCode',
  'destroyCode',
  'updateNote',
  'destroyNote'
])

module.exports = Reflux.createStore({
  listenables: [actions],
  Actions: actions,
  onUpdatePlanet: function (planet) {

  },
  onUpdateCode: function (code) {
    code.type = 'code'

    var planet = JSON.parse(localStorage.getItem('planet-' + code.PlanetId))
    if (planet != null) {
      var isNew = !planet.Codes.some(function (_code, index) {
        if (code.id === _code.id) {
          planet.Codes.splice(index, 1, code)
          return true
        }
        return false
      })

      if (isNew) planet.Codes.unshift(code)

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
      planet.Codes.some(function (_code, index) {
        if (code.id === _code.id) {
          planet.Codes.splice(index, 1)
          return true
        }
        return false
      })

      localStorage.setItem('planet-' + code.PlanetId, JSON.stringify(planet))
    }

    this.trigger({
      status: 'codeDestroyed',
      data: code
    })
  },
  onUpdateNote: function (note) {
    note.type = 'note'

    var planet = JSON.parse(localStorage.getItem('planet-' + note.PlanetId))
    if (planet != null) {
      var isNew = !planet.Notes.some(function (_note, index) {
        if (note.id === _note.id) {
          planet.Notes.splice(index, 1, note)
          return true
        }
        return false
      })

      if (isNew) planet.Codes.unshift(note)

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
      planet.Notes.some(function (_note, index) {
        if (note.id === _note.id) {
          planet.Notes.splice(index, 1)
          return true
        }
        return false
      })

      localStorage.setItem('planet-' + note.PlanetId, JSON.stringify(planet))
    }

    this.trigger({
      status: 'noteDestroyed',
      data: note
    })
  }
})
