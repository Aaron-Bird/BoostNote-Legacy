import { combineReducers } from 'redux'
import { findIndex } from 'lodash'
import { SWITCH_USER, SWITCH_FOLDER, SWITCH_MODE, SWITCH_ARTICLE, SET_SEARCH_FILTER, SET_TAG_FILTER, USER_UPDATE, ARTICLE_REFRESH, ARTICLE_UPDATE, ARTICLE_DESTROY, IDLE_MODE, CREATE_MODE } from './actions'
import auth from 'boost/auth'

const initialStatus = {
  mode: IDLE_MODE,
  search: ''
}

function getInitialArticles () {
  let initialCurrentUser = auth.user()
  if (initialCurrentUser == null) return []

  let teams = Array.isArray(initialCurrentUser.Teams) ? initialCurrentUser.Teams : []

  let users = [initialCurrentUser, ...teams]
  let initialArticles = users.reduce((res, user) => {
    res['team-' + user.id] = JSON.parse(localStorage.getItem('team-' + user.id))
    return res
  }, {})

  return initialArticles
}

function currentUser (state, action) {
  switch (action.type) {
    case USER_UPDATE:
      let user = action.data.user

      return auth.user(user)
    default:
      if (state == null) return auth.user()
      return state
  }
}

function status (state, action) {
  switch (action.type) {
    case SWITCH_USER:
      state.userId = action.data
      state.mode = IDLE_MODE
      state.search = ''
      return state
    case SWITCH_FOLDER:
      state.mode = IDLE_MODE
      state.search = `in:${action.data} `
      return state
    case SWITCH_MODE:
      state.mode = action.data
      if (state.mode === CREATE_MODE) state.articleKey = null

      return state
    case SWITCH_ARTICLE:
      state.articleKey = action.data
      state.mode = IDLE_MODE
      return state
    case SET_SEARCH_FILTER:
      state.search = action.data
      state.mode = IDLE_MODE
      return state
    case SET_TAG_FILTER:
      state.search = `#${action.data}`
      state.mode = IDLE_MODE
      return state
    default:
      if (state == null) return initialStatus
      return state
  }
}

function genKey (id) {
  return 'team-' + id
}

function articles (state, action) {
  switch (action.type) {
    case ARTICLE_REFRESH:
      {
        let { userId, articles } = action.data
        let teamKey = genKey(userId)
        localStorage.setItem(teamKey, JSON.stringify(articles))
        state[teamKey] = articles
      }

      return state
    case ARTICLE_UPDATE:
      {
        let { userId, article } = action.data
        let teamKey = genKey(userId)
        let articles = JSON.parse(localStorage.getItem(teamKey))

        let targetIndex = findIndex(articles, _article => article.key === _article.key)
        console.log('before')
        console.log(articles)
        if (targetIndex < 0) articles.unshift(article)
        else articles.splice(targetIndex, 1, article)
        console.log('after')
        console.log(articles)

        localStorage.setItem(teamKey, JSON.stringify(articles))
        state[teamKey] = articles
      }
      return state
    case ARTICLE_DESTROY:
      {
        let { userId, articleKey } = action.data
        let teamKey = genKey(userId)
        let articles = JSON.parse(localStorage.getItem(teamKey))
        console.log(articles)
        console.log(articleKey)
        let targetIndex = findIndex(articles, _article => articleKey === _article.key)
        if (targetIndex >= 0) articles.splice(targetIndex, 1)

        localStorage.setItem(teamKey, JSON.stringify(articles))
        state[teamKey] = articles
      }
      return state
    default:
      if (state == null) return getInitialArticles()
      return state
  }
}

export default combineReducers({
  currentUser,
  status,
  articles
})
