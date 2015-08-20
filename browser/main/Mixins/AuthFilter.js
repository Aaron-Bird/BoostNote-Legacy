/* global localStorage*/

var mixin = {}

mixin.OnlyGuest = {
  componentDidMount: function () {
    var currentUser = localStorage.getItem('currentUser')

    if (currentUser == null) {
      return
    }
    this.transitionTo('userHome', {userName: currentUser.name})
  }
}

mixin.OnlyUser = {
  componentDidMount: function () {
    var currentUser = localStorage.getItem('currentUser')

    if (currentUser == null) {
      this.transitionTo('login')
      return
    }
  }
}

module.exports = mixin
