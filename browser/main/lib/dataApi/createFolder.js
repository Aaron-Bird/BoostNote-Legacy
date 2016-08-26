const _ = require('lodash')
const sander = require('sander')
const keygen = require('browser/lib/keygen')
const path = require('path')

const defaultDataJSON = {
  notes: []
}

/**
 * @param {String} storageKey
 * @param {Object} input
 * ```
 * {
 *   color: String,
 *   name: String
 * }
 * ```
 *
 * @return {key}
 */
function createFolder (storageKey, input) {
  let rawStorages
  let targetStorage
  try {
    if (input == null) throw new Error('No input found.')
    if (!_.isString(input.name)) throw new Error('Name must be a string.')
    if (!_.isString(input.color)) throw new Error('Color must be a string.')

    rawStorages = JSON.parse(localStorage.getItem('storages'))
    if (!_.isArray(rawStorages)) throw new Error('Target storage doesn\'t exist.')

    targetStorage = _.find(rawStorages, {key: storageKey})
    if (targetStorage == null) throw new Error('Target storage doesn\'t exist.')
  } catch (e) {
    return Promise.reject(e)
  }

  const storageData = Object.assign({}, targetStorage)

  const boostnoteJSONPath = path.join(targetStorage.path, 'boostnote.json')
  return Promise.resolve()
    .then(function fetchBoostnoteJSON () {
      return sander.readFile(boostnoteJSONPath)
    })
    .then(function updateBoostnoteJSON (data) {
      let boostnoteJSON
      // If `boostnote.json` is invalid, reset `boostnote.json`.
      try {
        boostnoteJSON = JSON.parse(data)
        if (!_.isArray(boostnoteJSON.folders)) throw new Error('the value of `folders` must be array')
      } catch (err) {
        boostnoteJSON = {
          folders: []
        }
      }

      let key = keygen()
      while (boostnoteJSON.folders.some((folder) => folder.key === key)) {
        key = keygen()
      }

      let newFolder = {
        key,
        color: input.color,
        name: input.name
      }
      boostnoteJSON.folders.push(newFolder)

      storageData.folders = boostnoteJSON.folders

      return sander.writeFile(boostnoteJSONPath, JSON.stringify(boostnoteJSON))
        .then(() => newFolder)
    })
    .then(function createDataJSON (newFolder) {
      const folderDirPath = path.join(targetStorage.path, newFolder.key)
      return sander.writeFile(folderDirPath, 'data.json', JSON.stringify(defaultDataJSON))
    })
    .then(function returnData () {
      return {
        storage: storageData
      }
    })
}

module.exports = createFolder
