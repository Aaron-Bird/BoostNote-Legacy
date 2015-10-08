/* global localStorage*/

var mixin = {}

mixin.OnlyGuest = {
  componentDidMount: function () {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'))

    if (currentUser == null) {
      return
    }
    this.transitionTo('homeDefault')
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
