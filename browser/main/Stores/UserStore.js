/* global localStorage */

var Reflux = require('reflux')

var actions = Reflux.createActions([
  'update',
  'destroy'
])

module.exports = Reflux.createStore({
  listenables: [actions],
  onUpdate: function (user) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'))

    if (currentUser.id === user.id) {
      localStorage.setItem('currentUser', JSON.stringify(user))
    }

    if (user.userType === 'team') {
      var isMyTeam = user.Members.some(function (member) {
        if (currentUser.id === member.id) {
          return true
        }
        return false
      })

      if (isMyTeam) {
        var isNew = !currentUser.Teams.some(function (team, index) {
          if (user.id === team.id) {
            currentUser.Teams.splice(index, 1, user)
            return true
          }
          return false
        })

        if (isNew) {
          currentUser.Teams.push(user)
        }
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
      }
    }

    this.trigger({
      status: 'userUpdated',
      data: user
    })
  },
  onDestroy: function (user) {
    this.trigger({
      status: 'userDestroyed',
      data: user
    })
  },
  Actions: actions
})
