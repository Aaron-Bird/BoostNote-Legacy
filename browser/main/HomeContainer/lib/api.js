var request = require('superagent-promise')(require('superagent'), Promise)
var apiUrl = require('../../../../config').apiUrl

export function fetchCurrentUser () {
  return request
    .get(apiUrl + 'auth/user')
    .set({
      Authorization: 'Bearer ' + localStorage.getItem('token')
    })
}

export function fetchArticles (userId) {
  return request
    .get(apiUrl + 'teams/' + userId + '/articles')
    .set({
      Authorization: 'Bearer ' + localStorage.getItem('token')
    })
}

export function createTeam (input) {
  return request
    .post(apiUrl + 'teams')
    .set({
      Authorization: 'Bearer ' + localStorage.getItem('token')
    })
    .send(input)
}

export function searchUser (key) {
  return request
    .get(apiUrl + 'search/users')
    .query({key: key})
}

export function setMember (teamId, input) {
  return request
    .post(apiUrl + 'teams/' + teamId + '/members')
    .set({
      Authorization: 'Bearer ' + localStorage.getItem('token')
    })
    .send(input)
}

export function deleteMember (teamId, input) {
  return request
    .del(apiUrl + 'teams/' + teamId + '/members')
    .set({
      Authorization: 'Bearer ' + localStorage.getItem('token')
    })
    .send(input)
}
