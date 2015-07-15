/* global localStorage */
var Reflux = require('reflux')
var request = require('superagent')

var PlanetActions = require('../Actions/PlanetActions')

var PlanetStore = Reflux.createStore({
  init: function () {
    this.listenTo(PlanetActions.fetchPlanet, this.fetchPlanet)
    this.listenTo(PlanetActions.createSnippet, this.createSnippet)
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
  }
})

module.exports = PlanetStore
