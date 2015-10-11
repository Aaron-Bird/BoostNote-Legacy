var request = require('superagent-promise')(require('superagent'), Promise)
var apiUrl = require('../../../config').apiUrl

module.exports = {
  // Auth
  login: function (input) {
    return request
      .post(apiUrl + 'auth/login')
      .send(input)
  },
  signup: function (input) {
    return request
      .post(apiUrl + 'auth/register')
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
  fetchArticles: function (userId) {
    return request
      .get(apiUrl + 'teams/' + userId +'/articles')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
  },
  fetchArticlesByFolderId: function (folderId) {
    return request
      .get(apiUrl + 'folders/' + folderId +'/articles')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
  },
  createArticle: function (input) {
    return request
      .post(apiUrl + 'folders/' + input.FolderId + '/articles')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
  },
  updateArticle: function (articleId, input) {
    return request
      .put(apiUrl + 'articles/' + articleId)
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
  },
  // Search
  searchTag: function (tagName) {
    return request
      .get(apiUrl + 'search/tags')
      .query({name: tagName})
  },
  searchUser: function (userName) {
    return request
      .get(apiUrl + 'search/users')
      .query({name: userName})
  },

  // Mail
  sendEmail: function (input) {
    return request
      .post(apiUrl + 'mail')
      .set({
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
      .send(input)
  }
}
