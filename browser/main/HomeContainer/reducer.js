import { combineReducers } from 'redux'
import { PARAMS_CHANGE, USER_UPDATE } from './actions'

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

function params (state, action) {
  switch (action.type) {
    case PARAMS_CHANGE:
      return action.data
    default:
      if (state == null) return initialParams
      return state
  }
}

export default combineReducers({
  currentUser,
  params
})
