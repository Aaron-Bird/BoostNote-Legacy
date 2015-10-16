// initial value
var currentUser = JSON.parse(localStorage.getItem('currentUser'))
var currentToken = localStorage.getItem('token')

function user (user, newToken) {
  if (user != null) {
    localStorage.setItem('currentUser', JSON.stringify(user))
    currentUser = user
  }

  if (newToken != null) {
    localStorage.setItem('token', newToken)
    currentToken = newToken
  }

  return currentUser
}

function token () {
  return currentToken
}

function clear () {
  localStorage.removeItem('currentUser')
  localStorage.removeItem('token')
  currentUser = null
  currentToken = null
}

export default {
  user,
  token,
  clear
}
