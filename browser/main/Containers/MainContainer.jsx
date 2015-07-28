var React = require('react/addons')
var ReactRouter = require('react-router')
var RouteHandler = ReactRouter.RouteHandler

var AuthStore = require('../Stores/AuthStore')

module.exports = React.createClass({
    mixins: [ReactRouter.Navigation, ReactRouter.State],
    componentDidMount: function () {
      this.unsubscribe = AuthStore.listen(this.onListen)
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
