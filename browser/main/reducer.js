import { combineReducers } from 'redux'
import { findIndex } from 'lodash'
import { SWITCH_USER, SWITCH_FOLDER, SWITCH_MODE, SWITCH_ARTICLE, USER_UPDATE, ARTICLE_REFRESH, ARTICLE_UPDATE, ARTICLE_DESTROY, IDLE_MODE, CREATE_MODE } from './actions'

const initialCurrentUser = JSON.parse(localStorage.getItem('currentUser'))
const initialStatus = {
  mode: IDLE_MODE
}
// init articles
let teams = Array.isArray(initialCurrentUser.Teams) ? initialCurrentUser.Teams : []
let users = [initialCurrentUser, ...teams]
const initialArticles = users.reduce((res, user) => {
  res['team-' + user.id] = JSON.parse(localStorage.getItem('team-' + user.id))
  return res
}, {})

function currentUser (state, action) {
  switch (action.type) {
    case USER_UPDATE:
      let user = action.data
      localStorage.setItem('currentUser', JSON.stringify(user))
      return user
    default:
      if (state == null) return initialCurrentUser
      return state
  }
}

function status (state, action) {
  switch (action.type) {
    case SWITCH_USER:
      state.userId = action.data
      state.mode = IDLE_MODE
      state.folderId = null
      return state
    case SWITCH_FOLDER:
      state.folderId = action.data
      state.mode = IDLE_MODE
      return state
    case SWITCH_MODE:
      state.mode = action.data
      if (state.mode === CREATE_MODE) state.articleId = null
      return state
    case SWITCH_ARTICLE:
      state.articleId = action.data
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

        let targetIndex = findIndex(articles, _article => article.id === _article.id)
        if (targetIndex < 0) articles.unshift(article)
        else articles.splice(targetIndex, 1, article)

        localStorage.setItem(teamKey, JSON.stringify(articles))
        state[teamKey] = articles
      }
      return state
    case ARTICLE_DESTROY:
      {
        let { userId, articleId } = action.data
        let teamKey = genKey(userId)
        let articles = JSON.parse(localStorage.getItem(teamKey))

        let targetIndex = findIndex(articles, _article => articleId === _article.id)
        if (targetIndex >= 0) articles.splice(targetIndex, 1)

        localStorage.setItem(teamKey, JSON.stringify(articles))
        state[teamKey] = articles
      }
      return state
    default:
      if (state == null) return initialArticles
      return state
  }
}

export default combineReducers({
  currentUser,
  status,
  articles
})
