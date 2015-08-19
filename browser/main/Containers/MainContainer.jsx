/* global localStorage */

var ipc = require('ipc')

var React = require('react/addons')
var ReactRouter = require('react-router')
var RouteHandler = ReactRouter.RouteHandler
var Navigation = ReactRouter.Navigation
var State = ReactRouter.State

var Hq = require('../Services/Hq')

var Modal = require('../Mixins/Modal')

var UserStore = require('../Stores/UserStore')

var ContactModal = require('../Components/ContactModal')

function fetchPlanet (userName, planetName) {
  Hq.fetchPlanet(userName, planetName)
    .then(function (res) {
      var planet = res.body

      planet.Codes.forEach(function (code) {
        code.type = 'code'
      })

      planet.Notes.forEach(function (note) {
        note.type = 'note'
      })

      console.log('planet-' + planet.id + ' fetched!')
      localStorage.setItem('planet-' + planet.id, JSON.stringify(planet))
    })
    .catch(function (err) {
      console.error(err)
    })
}

module.exports = React.createClass({
  mixins: [State, Navigation, Modal],
  getInitialState: function () {
    return {
      updateAvailable: false
    }
  },
  componentDidMount: function () {
    ipc.on('update-available', function (message) {
      this.setState({updateAvailable: true})
    }.bind(this))

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
        var user = res.body
        localStorage.setItem('currentUser', JSON.stringify(user))
        UserStore.Actions.update(user)

        user.Planets.forEach(function (planet) {
          fetchPlanet(planet.userName, planet.name)
        })
        user.Teams.forEach(function (team) {
          team.Planets.forEach(function (planet) {
            fetchPlanet(planet.userName, planet.name)
          })
        })

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
  updateApp: function () {
    ipc.send('update-app', 'Deal with it.')
  },
  openContactModal: function () {
    this.openModal(ContactModal)
  },
  render: function () {
    return (
      <div className='Main'>
        {this.state.updateAvailable ? (
        <button onClick={this.updateApp} className='appUpdateButton'><i className='fa fa-cloud-download'/> Update available!</button>
        ) : null}
        <button onClick={this.openContactModal} className='contactButton'><i className='fa fa-paper-plane-o'/></button>
        <RouteHandler/>
      </div>
    )
  }
})
