import superagent from 'superagent'
import superagentPromise from 'superagent-promise'
import auth from 'boost/auth'

export const API_URL = 'http://boost-api4.elasticbeanstalk.com/'
// export const WEB_URL = 'http://b00st.io/'
export const WEB_URL = 'http://localhost:3333/'

export const request = superagentPromise(superagent, Promise)

export function login (input) {
  return request
    .post(API_URL + 'auth/login')
    .send(input)
}

export function signup (input) {
  return request
    .post(API_URL + 'auth/register')
    .send(input)
}

export function updateUserInfo (input) {
  return request
    .put(API_URL + 'auth/user')
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
    .send(input)
}

export function updatePassword (input) {
  return request
    .post(API_URL + 'auth/password')
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
    .send(input)
}

export function fetchCurrentUser () {
  return request
    .get(API_URL + 'auth/user')
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
}

export function fetchArticles (userId) {
  return request
    .get(API_URL + 'teams/' + userId + '/articles')
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
}

export function createArticle (input) {
  return request
    .post(API_URL + 'articles/')
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
    .send(input)
}

export function saveArticle (input) {
  return request
    .put(API_URL + 'articles/' + input.id)
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
    .send(input)
}

export function destroyArticle (articleId) {
  return request
    .del(API_URL + 'articles/' + articleId)
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
}

export function createTeam (input) {
  return request
    .post(API_URL + 'teams')
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
    .send(input)
}

export function updateTeamInfo (teamId, input) {
  return request
    .put(API_URL + 'teams/' + teamId)
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
    .send(input)
}

export function destroyTeam (teamId) {
  return request
    .del(API_URL + 'teams/' + teamId)
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
}

export function searchUser (key) {
  return request
    .get(API_URL + 'search/users')
    .query({key: key})
}

export function setMember (teamId, input) {
  return request
    .post(API_URL + 'teams/' + teamId + '/members')
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
    .send(input)
}

export function deleteMember (teamId, input) {
  return request
    .del(API_URL + 'teams/' + teamId + '/members')
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
    .send(input)
}

export function createFolder (input) {
  return request
    .post(API_URL + 'folders/')
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
    .send(input)
}

export function updateFolder (id, input) {
  return request
    .put(API_URL + 'folders/' + id)
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
    .send(input)
}

export function destroyFolder (id) {
  return request
    .del(API_URL + 'folders/' + id)
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
}

export function sendEmail (input) {
  return request
    .post(API_URL + 'mail')
    .set({
      Authorization: 'Bearer ' + auth.token()
    })
    .send(input)
}

export default {
  API_URL,
  WEB_URL,
  request,
  login,
  signup,
  updateUserInfo,
  updatePassword,
  fetchCurrentUser,
  fetchArticles,
  createArticle,
  saveArticle,
  destroyArticle,
  createTeam,
  updateTeamInfo,
  destroyTeam,
  searchUser,
  setMember,
  deleteMember,
  createFolder,
  updateFolder,
  destroyFolder,
  sendEmail
}
