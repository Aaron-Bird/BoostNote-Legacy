/* global localStorage */

var React = require('react/addons')
var ReactRouter = require('react-router')
var RouteHandler = ReactRouter.RouteHandler
var Navigation = ReactRouter.Navigation
var State = ReactRouter.State

var Hq = require('../Services/Hq')

var UserStore = require('../Stores/UserStore')

// function fetchPlanet (planet) {
//   return Hq.fetchPlanet(planet.userName, planet.name)
//     .then(function (res) {
//       var _planet = res.body
//       _planet.userName = planet.userName
//
//       _planet.Snippets = _planet.Snippets.map(function (snippet) {
//         snippet.type = 'snippet'
//         return snippet
//       })
//
//       _planet.Blueprints = _planet.Blueprints.map(function (blueprint) {
//         blueprint.type = 'blueprint'
//         return blueprint
//       })
//
//       localStorage.setItem('planet-' + _planet.id, JSON.stringify(_planet))
//       console.log('planet-' + _planet.id + ' fetched')
//     })
//     .catch(function (err) {
//       console.error(err)
//     })
// }

module.exports = React.createClass({
  mixins: [State, Navigation],
  componentDidMount: function () {
    if (this.isActive('root')) {
      if (localStorage.getItem('currentUser') == null) {
        this.transitionTo('login')
        return
      } else {
        this.transitionTo('home')
        return
      }
    }

    Hq.getUser()
      .then(function (res) {
        console.log(res.body)
        localStorage.setItem('currentUser', JSON.stringify(res.body))
        UserStore.Actions.update(res.body)
      })
      .catch(function (err) {
        if (err.status === 401) {
          console.log('Not logged in yet')
          localStorage.removeItem('currentUser')
          this.transitionTo('login')
          return
        }
        console.error(err)
      }.bind(this))
  },
  render: function () {
    return (
      <div className='Main'>
        <RouteHandler/>
      </div>
    )
  }
})
