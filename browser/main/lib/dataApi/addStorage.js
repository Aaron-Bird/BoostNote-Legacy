const _ = require('lodash')
const keygen = require('browser/lib/keygen')
const resolveStorageData = require('./resolveStorageData')
const resolveStorageNotes = require('./resolveStorageNotes')

/**
 * @param {Object}
 * name, path, type
 *
 * 1. check if BoostnoteJSON can be created
 *   if the file doesn't exist or isn't valid, try to rewrite it.
 *   if the rewriting failed, throw Error
 * 2. save metadata to localStorage
 * 3. fetch notes & folders
 * 4. return `{storage: {...} folders: [folder]}`
 */
function addStorage (input) {
  if (!_.isString(input.path)) {
    return Promise.reject(new Error('Path must be a string.'))
  }
  let rawStorages
  try {
    rawStorages = JSON.parse(localStorage.getItem('storages'))
    if (!_.isArray(rawStorages)) throw new Error('invalid storages')
  } catch (e) {
    console.warn(e)
    rawStorages = []
  }
  let key = keygen()
  while (rawStorages.some((storage) => storage.key === key)) {
    key = keygen()
  }

  let newStorage = {
    key,
    name: input.name,
    type: input.type,
    path: input.path
  }

  return Promise.resolve(newStorage)
    .then(resolveStorageData)
    .then(function saveMetadataToLocalStorage () {
      rawStorages.push({
        key: newStorage.key,
        type: newStorage.type,
        name: newStorage.name,
        path: newStorage.path
      })

      localStorage.setItem('storages', JSON.stringify(rawStorages))
      return newStorage
    })
    .then(resolveStorageNotes)
    .then(function returnValue (notes) {
      return {
        storage: newStorage,
        notes
      }
    })
}

module.exports = addStorage
