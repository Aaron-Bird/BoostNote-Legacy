/* global localStorage */

var request = require('superagent-promise')(require('superagent'), Promise)
var apiUrl = require('../../../config').apiUrl

module.exports = {
  // Auth
  login: function (input) {
    return request
      .post(apiUrl + 'auth')
      .send(input)
  },
  signup: function (input) {
    return request
      .post(apiUrl + 'auth/signup')
      .send(input)
  },
  getUser: function () {
    return request
      .get(apiUrl + 'auth/user')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
  },
  changePassword: function (input) {
    return request
      .post(apiUrl + 'auth/password')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
  },

  // Resources
  fetchUser: function (userName) {
    return request
      .get(apiUrl + 'resources/' + userName)
  },
  updateUser: function (userName, input) {
    return request
      .put(apiUrl + 'resources/' + userName)
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
  },
  createPlanet: function (userName, input) {
    return request
      .post(apiUrl + 'resources/' + userName + '/planets')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
  },
  fetchPlanet: function (userName, planetName) {
    return request
      .get(apiUrl + 'resources/' + userName + '/planets/' + planetName)
  },
  createCode: function (userName, planetName, input) {
    return request
      .post(apiUrl + 'resources/' + userName + '/planets/' + planetName + '/codes')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
  },
  updateCode: function (userName, planetName, localId, input) {
    return request
      .put(apiUrl + 'resources/' + userName + '/planets/' + planetName + '/codes/' + localId)
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
  },
  destroyCode: function (userName, planetName, localId) {
    return request
      .del(apiUrl + 'resources/' + userName + '/planets/' + planetName + '/codes/' + localId)
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
  },
  createNote: function (userName, planetName, input) {
    return request
      .post(apiUrl + 'resources/' + userName + '/planets/' + planetName + '/notes')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
  },
  updateNote: function (userName, planetName, localId, input) {
    return request
      .put(apiUrl + 'resources/' + userName + '/planets/' + planetName + '/notes/' + localId)
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
  },
  destroyNote: function (userName, planetName, localId) {
    return request
      .del(apiUrl + 'resources/' + userName + '/planets/' + planetName + '/notes/' + localId)
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
  },

  // Search
  searchTag: function (tagName) {
    return request
      .get(apiUrl + 'search/tags')
      .query({name: tagName})
  }
}
