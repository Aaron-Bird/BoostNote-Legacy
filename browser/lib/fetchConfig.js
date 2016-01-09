const electron = require('electron')
const remote = electron.remote
const jetpack = require('fs-jetpack')

const userDataPath = remote.app.getPath('userData')
const configFile = 'config.json'

export default function fetchConfig () {
  return Object.assign({}, JSON.parse(jetpack.cwd(userDataPath).read(configFile, 'utf-8')))
}
