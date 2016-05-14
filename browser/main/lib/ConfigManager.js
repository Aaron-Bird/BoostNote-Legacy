import _ from 'lodash'

const defaultConfig = {
  zoom: 1,
  isSideNavFolded: false
}

function _validate (config) {
  if (!_.isObject(config)) return false
  if (!_.isNumber(config.zoom) || config.zoom < 0) return false
  if (!_.isBoolean(config.isSideNavFolded)) return false

  return true
}

function _save (config) {
  window.localStorage.setItem('config', JSON.stringify(config))
}

function get () {
  let config = window.localStorage.getItem('config')

  try {
    config = JSON.parse(config)
    if (!_validate(config)) throw new Error('INVALID CONFIG')
  } catch (err) {
    console.warn('Boostnote resets the malformed configuration.')
    config = defaultConfig
    _save(config)
  }

  return config
}

function set (updates) {
  let currentConfig = get()
  let newConfig = Object.assign({}, defaultConfig, currentConfig, updates)
  if (!_validate(newConfig)) throw new Error('INVALID CONFIG')
  _save(newConfig)
}

export default {
  get,
  set
}
