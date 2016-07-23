import _ from 'lodash'

const OSX = global.process.platform === 'darwin'
const electron = require('electron')
const { ipcRenderer } = electron

const defaultConfig = {
  zoom: 1,
  isSideNavFolded: false,
  listWidth: 250,
  hotkey: {
    toggleFinder: OSX ? 'Cmd + Alt + S' : 'Super + Alt + S',
    toggleMain: OSX ? 'Cmd + Alt + L' : 'Super + Alt + E'
  },
  ui: {
    theme: 'default',
    disableDirectWrite: false
  },
  editor: {
    theme: 'xcode',
    fontSize: '14',
    fontFamily: 'Monaco, Consolas',
    indentType: 'space',
    indentSize: '4',
    switchPreview: 'BLUR' // Available value: RIGHTCLICK, BLUR
  },
  preview: {
    fontSize: '14',
    fontFamily: 'Lato',
    codeBlockTheme: 'xcode',
    lineNumber: true
  }
}

function validate (config) {
  if (!_.isObject(config)) return false
  if (!_.isNumber(config.zoom) || config.zoom < 0) return false
  if (!_.isBoolean(config.isSideNavFolded)) return false
  if (!_.isNumber(config.listWidth) || config.listWidth <= 0) return false

  return true
}

function _save (config) {
  console.log(config)
  window.localStorage.setItem('config', JSON.stringify(config))
}

function get () {
  let config = window.localStorage.getItem('config')

  try {
    config = Object.assign({}, defaultConfig, JSON.parse(config))
    if (!validate(config)) throw new Error('INVALID CONFIG')
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
  if (!validate(newConfig)) throw new Error('INVALID CONFIG')
  _save(newConfig)
  ipcRenderer.send('CONFIG_RENEW', {
    config: get(),
    silent: false
  })
}

ipcRenderer.send('CONFIG_RENEW', {
  config: get(),
  silent: true
})

export default {
  get,
  set,
  validate
}
