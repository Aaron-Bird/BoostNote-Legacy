/* global localStorage */
var Reflux = require('reflux')
var request = require('superagent')

var PlanetActions = require('../Actions/PlanetActions')

var apiUrl = 'http://localhost:8000/'

var PlanetStore = Reflux.createStore({
  init: function () {
    this.listenTo(PlanetActions.fetchPlanet, this.fetchPlanet)
    this.listenTo(PlanetActions.createSnippet, this.createSnippet)
    this.listenTo(PlanetActions.updateSnippet, this.updateSnippet)
    this.listenTo(PlanetActions.deleteSnippet, this.deleteSnippet)
    this.listenTo(PlanetActions.createBlueprint, this.createBlueprint)
    this.listenTo(PlanetActions.updateBlueprint, this.updateBlueprint)
    this.listenTo(PlanetActions.deleteBlueprint, this.deleteBlueprint)
  },
  fetchPlanet: function (planetName) {
    request
      .get(apiUrl + planetName)
      .send()
      .end(function (err, res) {
        if (err) {
          console.error(err)
          this.trigger(null)
          return
        }

        var planet = res.body
        planet.Snippets = planet.Snippets.map(function (snippet) {
          snippet.type = 'snippet'
          return snippet
        })

        planet.Blueprints = planet.Blueprints.map(function (blueprint) {
          blueprint.type = 'blueprint'
          return blueprint
        })

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
  createSnippet: function (planetName, input) {
    input.description = input.description.substring(0, 255)
    request
      .post(apiUrl + planetName + '/snippets')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
      .end(function (req, res) {
        this.trigger({
          status: 'snippetCreated',
          data: res.body
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
        this.trigger({
          status: 'snippetUpdated',
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
        this.trigger({
          status: 'snippetDeleted',
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
        this.trigger({
          status: 'blueprintCreated',
          data: res.body
        })
      }.bind(this))
  },
  updateBlueprint: function (id, input) {
    input.description = input.description.substring(0, 255)
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
        this.trigger({
          status: 'blueprintUpdated',
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
        this.trigger({
          status: 'blueprintDeleted',
          data: blueprint
        })
      }.bind(this))
  }
})

module.exports = PlanetStore
