/* global localStorage */
var Reflux = require('reflux')
var request = require('superagent')

var login = require('../Actions/login')
var register = require('../Actions/register')

var AuthStore = Reflux.createStore({
    init: function () {
      this.listenTo(login, this.login)
      this.listenTo(register, this.register)
    },
    // Reflux Store
    login: function (input) {
      request
        .post('http://localhost:8000/auth/login')
        .send(input)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (err) {
            console.error(err)
            this.trigger(null)
            return
          }

          var user = res.body.user
          localStorage.setItem('token', res.body.token)
          localStorage.setItem('user', JSON.stringify(res.body.user))

          this.trigger(user)
        }.bind(this))
    },
    register: function (input) {
      request
        .post('http://localhost:8000/auth/signup')
        .send(input)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (err) {
            console.error(err)
            this.trigger(null)
            return
          }

          var user = res.body.user
          localStorage.setItem('token', res.body.token)
          localStorage.setItem('user', JSON.stringify(res.body.user))

          this.trigger(user)
        }.bind(this))
    },
    // Methods
    check: function () {
      if (localStorage.getItem('token')) return true
      return false
    },
    getUser: function () {
      var userJSON = localStorage.getItem('user')
      if (userJSON == null) return null
      return JSON.parse(userJSON)
    }
})

module.exports = AuthStore
