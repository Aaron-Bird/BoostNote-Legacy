var Reflux = require('reflux')

var actions = Reflux.createActions([
  'update',
  'destroy'
])

module.exports = Reflux.createStore({
  listenables: [actions],
  onUpdate: function (user) {
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
