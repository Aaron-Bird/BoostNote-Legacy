import {combineReducers} from 'redux'

const initialCurrentUser = JSON.parse(localStorage.getItem('currentUser'))

function currentUser (state, action) {
  switch (action.type) {

    default:
      return initialCurrentUser
  }
}

export default combineReducers({
  currentUser
})
