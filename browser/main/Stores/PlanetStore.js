var Reflux = require('reflux')
var request = require('superagent')

var fetchPlanet = require('../Actions/fetchPlanet')

var updateSnippet = require('../Actions/updateSnippet')
var fetchSnippets = require('../Actions/fetchSnippets')

var PlanetStore = Reflux.createStore({
  init: function () {
    // this.listenTo(updateSnippet, this.updateSnippet)
    // this.listenTo(fetchSnippets, this.fetchSnippets)
    this.listenTo(fetchPlanet, this.fetchPlanet)
  },
  // planetName = user.name/planet.name
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

        this.trigger(planet)
      }.bind(this))
  },
  updateSnippet: function (input) {

  }
})

module.exports = PlanetStore
