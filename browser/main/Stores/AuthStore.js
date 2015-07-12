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
    login: function (input) {
      request
        .post('http://localhost:8000/auth/login')
        .send(input)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (err) console.error(err)
          var user = res.body.user
          localStorage.setItem('token', res.body.token)
          this.trigger(user)
        }.bind(this))
    },
    register: function (input) {
      request
        .post('http://localhost:8000/auth/signup')
        .send(input)
        .set('Accept', 'application/json')
        .end(function (err, res) {
          if (err) console.error(err)
          var user = res.body.user
          localStorage.setItem('token', res.body.token)
          this.trigger(user)
        }.bind(this))
    }
})

module.exports = AuthStore
