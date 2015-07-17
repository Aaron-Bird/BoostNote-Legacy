/* global localStorage */
var Reflux = require('reflux')
var request = require('superagent')

var PlanetActions = require('../Actions/PlanetActions')

var PlanetStore = Reflux.createStore({
  init: function () {
    this.listenTo(PlanetActions.fetchPlanet, this.fetchPlanet)
    this.listenTo(PlanetActions.createSnippet, this.createSnippet)
    this.listenTo(PlanetActions.updateSnippet, this.updateSnippet)
    this.listenTo(PlanetActions.deleteSnippet, this.deleteSnippet)
  },
  fetchPlanet: function (planetName) {
    request
      .get('http://localhost:8000/' + planetName)
      .send()
      .end(function (err, res) {
        if (err) {
          console.error(err)
          this.trigger(null)
          return
        }

        var planet = res.body
        planet.Snippets = planet.Snippets.sort(function (a, b) {
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
      .post('http://localhost:8000/' + planetName + '/snippets')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
      .end(function (req, res) {
        console.log('snippet created', res.body)
        this.trigger({
          status: 'snippetCreated',
          data: res.body
        })
      }.bind(this))
  },
  updateSnippet: function (id, input) {
    input.description = input.description.substring(0, 255)
    request
      .put('http://localhost:8000/snippets/id/' + id)
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
      .del('http://localhost:8000/snippets/id/' + id)
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
  }
})

module.exports = PlanetStore
