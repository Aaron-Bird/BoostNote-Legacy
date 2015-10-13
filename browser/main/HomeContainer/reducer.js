import { combineReducers } from 'redux'
import { SWITCH_USER, SWITCH_FOLDER, SWITCH_MODE, USER_UPDATE, ARTICLE_UPDATE, IDLE_MODE, CREATE_MODE, EDIT_MODE } from './actions'

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
      console.log(action)
      state.folderId = null
      return state
    case SWITCH_FOLDER:
      state.folderId = action.data
      return state
    case SWITCH_MODE:
      state.mode = action.data
      return state
    default:
      if (state == null) return initialStatus
      return state
  }
}

function articles (state, action) {
  switch (action.type) {
    case ARTICLE_UPDATE:
      let { userId, articles } = action.data
      let teamKey = 'team-' + userId
      localStorage.setItem(teamKey, JSON.stringify(articles))
      state[teamKey] = articles
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
