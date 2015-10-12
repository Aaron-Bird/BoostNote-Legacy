import { combineReducers } from 'redux'
import { SWITCH_USER, SWITCH_FOLDER, USER_UPDATE } from './actions'

const initialCurrentUser = JSON.parse(localStorage.getItem('currentUser'))
const initialParams = {}

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
    default:
      if (state == null) return initialParams
      return state
  }
}

export default combineReducers({
  currentUser,
  status
})
