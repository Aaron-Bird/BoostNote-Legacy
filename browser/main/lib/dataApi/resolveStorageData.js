const _ = require('lodash')
const path = require('path')
const CSON = require('season')
const transform = require('./transform')

function resolveStorageData (storageCache) {
  let storage = {
    key: storageCache.key,
    name: storageCache.name,
    type: storageCache.type,
    path: storageCache.path
  }

  const boostnoteJSONPath = path.join(storageCache.path, 'boostnote.json')
  try {
    let jsonData = CSON.readFileSync(boostnoteJSONPath)
    if (!_.isArray(jsonData.folders)) throw new Error('folders should be an array.')
    storage.folders = jsonData.folders
    storage.version = jsonData.version
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn('boostnote.json file doesn\'t exist the given path')
      CSON.writeFileSync(boostnoteJSONPath, {folders: [], version: '1.0'})
    } else {
      console.error(err)
    }
    storage.folders = []
    storage.version = '1.0'
  }

  if (storage.version === '1.0') {
    return Promise.resolve(storage)
  }
  console.log('Transform Legacy storage', storage.path)
  return transform(storage.path)
    .then(() => storage)
}

module.exports = resolveStorageData
