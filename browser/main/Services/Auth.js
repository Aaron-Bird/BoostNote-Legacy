/* global localStorage */
var Auth = {}

var currentUser = null
Auth.attempt = function (params) {
  return new Promise(function (resolve, reject) {
    var token = 'some token'
    var user = {
      name: 'testcat',
      email: 'testcat@example.com',
      profileName: 'Test Cat'
    }
    localStorage.setItem('token', token)

    resolve(user)
  })
}

Auth.register = function (params) {
  return new Promise(function (resolve, reject) {
    var token = 'some token'
    var user = {
      name: 'testcat',
      email: 'testcat@example.com',
      profileName: 'Test Cat'
    }
    localStorage.setItem('token', token)

    resolve(user)
  })
}

Auth.getUser = function () {
  return new Promise(function (resolve, reject) {

    resolve(currentUser)
  })
}

module.exports = Auth
