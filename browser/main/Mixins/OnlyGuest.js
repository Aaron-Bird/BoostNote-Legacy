var AuthStore = require('../Stores/AuthStore')

var OnlyGuest = {
  componentDidMount: function () {
    if (AuthStore.check()) {
      var user = AuthStore.getUser()
      if (user == null) {
        return
      }
      var planet = user.Planets.length > 0 ? user.Planets[0] : null
      if (planet == null) {
        this.transitionTo('user', {userName: user.name})
        return
      }
      this.transitionTo('dashboard', {userName: user.name, planetName: planet.name})
    }
  }
}

module.exports = OnlyGuest
