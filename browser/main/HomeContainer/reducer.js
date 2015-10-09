import { combineReducers } from 'redux'
import { USER_UPDATE } from './actions'

const initialCurrentUser = JSON.parse(localStorage.getItem('currentUser'))

function currentUser (state, action) {
  switch (action.type) {
    case USER_UPDATE:
      let user = action.data
      localStorage.setItem('currentUser', JSON.stringify(user))
      return user
    default:
      return initialCurrentUser
  }
}

export default combineReducers({
  currentUser
})
