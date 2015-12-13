import _ from 'lodash'
import keygen from 'boost/keygen'

function getClientKey () {
  let clientKey = localStorage.getItem('clientKey')
  if (!_.isString(clientKey) || clientKey.length !== 40) {
    clientKey = keygen()
    setClientKey(clientKey)
  }

  return clientKey
}

function setClientKey (newKey) {
  localStorage.setItem('clientKey', newKey)
}

getClientKey()

export default {
  get: getClientKey,
  set: setClientKey
}
