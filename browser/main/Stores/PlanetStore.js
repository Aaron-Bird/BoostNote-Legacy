/* global localStorage */
var Reflux = require('reflux')
var request = require('superagent')

var PlanetActions = require('../Actions/PlanetActions')

var apiUrl = require('../../../config').apiUrl

var PlanetStore = Reflux.createStore({
  init: function () {
    this.listenTo(PlanetActions.createPlanet, this.createPlanet)
    this.listenTo(PlanetActions.fetchPlanet, this.fetchPlanet)
    this.listenTo(PlanetActions.deletePlanet, this.deletePlanet)
    this.listenTo(PlanetActions.changeName, this.changeName)
    this.listenTo(PlanetActions.addUser, this.addUser)
    this.listenTo(PlanetActions.removeUser, this.removeUser)
    this.listenTo(PlanetActions.createSnippet, this.createSnippet)
    this.listenTo(PlanetActions.updateSnippet, this.updateSnippet)
    this.listenTo(PlanetActions.deleteSnippet, this.deleteSnippet)
    this.listenTo(PlanetActions.createBlueprint, this.createBlueprint)
    this.listenTo(PlanetActions.updateBlueprint, this.updateBlueprint)
    this.listenTo(PlanetActions.deleteBlueprint, this.deleteBlueprint)
  },
  createPlanet: function (input) {
    request
      .post(apiUrl + 'planets/create')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
      .end(function (err, res) {
        if (err) {
          console.error(err)
          this.trigger(null)
          return
        }

        var planet = res.body
        planet.Snippets = []
        planet.Blueprints = []
        planet.Articles = []

        this.trigger({
          status: 'planetCreated',
          data: planet
        })
      }.bind(this))
  },
  fetchPlanet: function (userName, planetName) {
    request
      .get(apiUrl + userName + '/' + planetName)
      .send()
      .end(function (err, res) {
        if (err) {
          console.error(err)
          this.trigger(null)
          return
        }

        var planet = res.body
        planet.userName = userName

        planet.Snippets = planet.Snippets.map(function (snippet) {
          snippet.type = 'snippet'
          return snippet
        })

        planet.Blueprints = planet.Blueprints.map(function (blueprint) {
          blueprint.type = 'blueprint'
          return blueprint
        })

        localStorage.setItem('planet-' + planet.id, JSON.stringify(planet))

        planet.Articles = planet.Snippets.concat(planet.Blueprints).sort(function (a, b) {
          a = new Date(a.updatedAt)
          b = new Date(b.updatedAt)
          return a < b ? 1 : a > b ? -1 : 0
        })

        this.trigger({
          status: 'planetFetched',
          data: planet
        })
      }.bind(this))
  },
  deletePlanet: function (userName, planetName) {
    request
      .del(apiUrl + userName + '/' + planetName)
      .send()
      .end(function (err, res) {
        if (err) {
          console.error(err)
          this.trigger(null)
          return
        }

        var planet = res.body
        localStorage.removeItem('planet-' + planet.id)

        this.trigger({
          status: 'planetDeleted',
          data: planet
        })
      }.bind(this))
  },
  changeName: function (userName, planetName, name) {
    request
      .put(apiUrl + userName + '/' + planetName)
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send({name: name})
      .end(function (err, res) {
        if (err) {
          console.error(err)
          this.trigger(null)
          return
        }

        var planet = res.body

        var user = JSON.parse(localStorage.getItem('user'))
        user.Planets.some(function (_planet, index) {
          if (planet.id === _planet.id) {
            user.Planets[index].name = planet.name
            return true
          }
          return false
        })
        localStorage.setItem('user', JSON.stringify(user))

        this.trigger({
          status: 'nameChanged',
          data: planet
        })
      }.bind(this))
  },
  addUser: function (planetName, userName) {
    request
      .post(apiUrl + planetName + '/users')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send({name: userName})
      .end(function (err, res) {
        if (err) {
          console.error(err)
          this.trigger(null)
          return
        }
        var user = res.body

        this.trigger({
          status: 'userAdded',
          data: user
        })
      }.bind(this))
  },
  removeUser: function (planetName, userName) {
    request
      .del(apiUrl + planetName + '/users')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send({name: userName})
      .end(function (err, res) {
        if (err) {
          console.error(err)
          this.trigger(null)
          return
        }
        var user = res.body

        this.trigger({
          status: 'userRemoved',
          data: user
        })
      }.bind(this))
  },
  createSnippet: function (planetName, input) {
    input.description = input.description.substring(0, 255)
    request
      .post(apiUrl + planetName + '/snippets')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
      .end(function (req, res) {
        var snippet = res.body
        snippet.type = 'snippet'

        var planet = JSON.parse(localStorage.getItem('planet-' + snippet.PlanetId))
        planet.Snippets.unshift(snippet)
        localStorage.setItem('planet-' + snippet.PlanetId, JSON.stringify(planet))

        this.trigger({
          status: 'articleCreated',
          data: snippet
        })
      }.bind(this))
  },
  updateSnippet: function (id, input) {
    input.description = input.description.substring(0, 255)
    request
      .put(apiUrl + 'snippets/id/' + id)
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
      .end(function (err, res) {
        if (err) {
          console.error(err)
          this.trigger(null)
          return
        }

        var snippet = res.body
        snippet.type = 'snippet'

        var planet = JSON.parse(localStorage.getItem('planet-' + snippet.PlanetId))
        planet.Snippets.some(function (_snippet, index) {
          if (snippet.id === _snippet) {
            planet.Snippets[index] = snippet
            return true
          }
          return false
        })
        localStorage.setItem('planet-' + snippet.PlanetId, JSON.stringify(planet))

        this.trigger({
          status: 'articleUpdated',
          data: snippet
        })
      }.bind(this))
  },
  deleteSnippet: function (id) {
    request
      .del(apiUrl + 'snippets/id/' + id)
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send()
      .end(function (err, res) {
        if (err) {
          console.error(err)
          this.trigger(null)
          return
        }

        var snippet = res.body

        var planet = JSON.parse(localStorage.getItem('planet-' + snippet.PlanetId))
        planet.Snippets.some(function (_snippet, index) {
          if (snippet.id === _snippet) {
            planet.splice(index, 1)
            return true
          }
          return false
        })
        localStorage.setItem('planet-' + snippet.PlanetId, JSON.stringify(planet))

        this.trigger({
          status: 'articleDeleted',
          data: snippet
        })
      }.bind(this))
  },
  createBlueprint: function (planetName, input) {
    input.title = input.title.substring(0, 255)
    request
      .post(apiUrl + planetName + '/blueprints')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
      .end(function (req, res) {
        var blueprint = res.body
        blueprint.type = 'blueprint'

        var planet = JSON.parse(localStorage.getItem('planet-' + blueprint.PlanetId))
        planet.Blueprints.unshift(blueprint)
        localStorage.setItem('planet-' + blueprint.PlanetId, JSON.stringify(planet))

        this.trigger({
          status: 'articleCreated',
          data: blueprint
        })
      }.bind(this))
  },
  updateBlueprint: function (id, input) {
    input.title = input.title.substring(0, 255)
    request
      .put(apiUrl + 'blueprints/id/' + id)
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
      .end(function (err, res) {
        if (err) {
          console.error(err)
          this.trigger(null)
          return
        }

        var blueprint = res.body
        blueprint.type = 'blueprint'

        var planet = JSON.parse(localStorage.getItem('planet-' + blueprint.PlanetId))
        planet.Blueprints.some(function (_blueprint, index) {
          if (blueprint.id === _blueprint) {
            planet.Blueprints[index] = blueprint
            return true
          }
          return false
        })
        localStorage.setItem('planet-' + blueprint.PlanetId, JSON.stringify(blueprint))

        this.trigger({
          status: 'articleUpdated',
          data: blueprint
        })
      }.bind(this))
  },
  deleteBlueprint: function (id) {
    request
      .del(apiUrl + 'blueprints/id/' + id)
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send()
      .end(function (err, res) {
        if (err) {
          console.error(err)
          this.trigger(null)
          return
        }

        var blueprint = res.body

        var planet = JSON.parse(localStorage.getItem('planet-' + blueprint.PlanetId))
        planet.Blueprints.some(function (_blueprint, index) {
          if (blueprint.id === _blueprint) {
            planet.splice(index, 1)
            return true
          }
          return false
        })
        localStorage.setItem('planet-' + blueprint.PlanetId, JSON.stringify(planet))

        this.trigger({
          status: 'articleDeleted',
          data: blueprint
        })
      }.bind(this))
  }
})

module.exports = PlanetStore
