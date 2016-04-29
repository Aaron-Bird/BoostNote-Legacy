const electron = require('electron')
const remote = electron.remote
const jetpack = require('fs-jetpack')

const userDataPath = remote.app.getPath('userData')
const configFile = 'config.json'

const defaultConfig = {
  'editor-font-size': '14',
  'editor-font-family': 'Monaco, Consolas',
  'editor-indent-type': 'space',
  'editor-indent-size': '4',
  'preview-font-size': '14',
  'preview-font-family': 'Lato',
  'switch-preview': 'blur',
  'disable-direct-write': false,
  'theme-ui': 'light',
  'theme-code': 'xcode',
  'theme-syntax': 'xcode'
}

export default function fetchConfig () {
  return Object.assign({}, defaultConfig, JSON.parse(jetpack.cwd(userDataPath).read(configFile, 'utf-8')))
}
