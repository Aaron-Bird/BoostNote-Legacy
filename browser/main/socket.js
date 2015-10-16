import { API_URL } from '../../config'
import socketio from 'socket.io-client'
import auth from 'boost/auth'
import store from './store'
import { updateArticle, destroyArticle } from './actions'

export const CONN = 'CONN'
export const ALERT = 'ALERT'
export const USER_UPDATE = 'USER_UPDATE'
export const ARTICLE_UPDATE = 'ARTICLE_UPDATE'
export const ARTICLE_DESTROY = 'ARTICLE_DESTROY'

let io = socketio(API_URL)

io.on(CONN, function (data) {
  console.log('connected', data)

  let token = auth.token()
  if (token != null) {
    io.emit('JOIN', {token})
  }
})

io.on(ALERT, function (data) {
  console.log(ALERT, data)
})

io.on(USER_UPDATE, function (data) {
  console.log(USER_UPDATE, data)
})

io.on(ARTICLE_UPDATE, function (data) {
  console.log(ARTICLE_UPDATE, data)
  let { userId, article } = data
  store.dispatch(updateArticle(userId, article))
})

io.on(ARTICLE_DESTROY, function (data) {
  console.log(ARTICLE_DESTROY, data)
  let { userId, articleKey } = data
  store.dispatch(destroyArticle(userId, articleKey))
})

export default io
