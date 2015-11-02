import { combineReducers } from 'redux'
import { SELECT_ARTICLE, SEARCH_ARTICLE, REFRESH_DATA } from './actions'

let data = JSON.parse(localStorage.getItem('local'))

let initialArticles = data != null ? data.articles : []
let initialFolders = data != null ? data.folders : []
let initialStatus = {
  articleKey: null,
  search: ''
}

function status (state = initialStatus, action) {
  switch (action.type) {
    case SELECT_ARTICLE:
      state.articleKey = action.data.key
      return state
    case SEARCH_ARTICLE:
      state.search = action.data.input
      return state
    default:
      return state
  }
}

function articles (state = initialArticles, action) {
  switch (action.type) {
    case REFRESH_DATA:
      return action.data.articles
    default:
      return state
  }
}

function folders (state = initialFolders, action) {
  switch (action.type) {
    case REFRESH_DATA:
      console.log(action)
      return action.data.folders
    default:
      return state
  }
}

export default combineReducers({
  status,
  folders,
  articles
})
