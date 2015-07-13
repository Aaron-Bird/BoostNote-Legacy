var Reflux = require('reflux')
var request = require('superagent')

var PlanetActions = require('../Actions/PlanetActions')

var PlanetStore = Reflux.createStore({
  init: function () {
    this.listenTo(PlanetActions.fetchPlanet, this.fetchPlanet)
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

        this.trigger(planet)
      }.bind(this))
  },
  updateSnippet: function (input) {

  }
})

module.exports = PlanetStore
