/* global localStorage */
var React = require('react/addons')
var ReactRouter = require('react-router')
var RouteHandler = ReactRouter.RouteHandler
var request = require('superagent')

var AuthStore = require('../Stores/AuthStore')

var apiUrl = require('../../../config').apiUrl

function fetchPlanet (planet) {
  request
    .get(apiUrl + planet.userName + '/' + planet.name)
    .send()
    .end(function (err, res) {
      if (err) {
        console.error(err)
        return
      }

      var _planet = res.body
      _planet.userName = planet.userName

      _planet.Snippets = _planet.Snippets.map(function (snippet) {
        snippet.type = 'snippet'
        return snippet
      })

      _planet.Blueprints = _planet.Blueprints.map(function (blueprint) {
        blueprint.type = 'blueprint'
        return blueprint
      })

      localStorage.setItem('planet-' + _planet.id, JSON.stringify(_planet))
      console.log('planet-' + _planet.id + ' fetched')
    })
}

module.exports = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State],
  componentDidMount: function () {
    this.unsubscribe = AuthStore.listen(this.onListen)

    var user = JSON.parse(localStorage.getItem('user'))
    if (user != null) {
      user.Planets.forEach(fetchPlanet)
      return
    }
    this.transitionTo('login')
  },
  componentWillUnmount: function () {
    this.unsubscribe()
  },
  onListen: function (res) {
    if (res == null || res.status == null) {
      return
    }

    if (res.status === 'loggedIn' || res.status === 'registered') {
      var user = res.data
      var planet = user.Planets.length > 0 ? user.Planets[0] : null
      if (planet == null) {
        this.transitionTo('user', {userName: user.name})
        return
      }
      this.transitionTo('planetHome', {userName: user.name, planetName: planet.name})

      return
    }

    if (res.status === 'loggedOut') {
      this.transitionTo('login')
      return
    }
  },
  render: function () {
    // Redirect Login state
    if (this.getPath() === '/') {
      this.transitionTo('/login')
    }
    return (
      <div className='Main'>
        <RouteHandler/>
      </div>
    )
  }
})
