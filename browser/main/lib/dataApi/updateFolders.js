const _ = require('lodash')
const path = require('path')
const resolveStorageData = require('./resolveStorageData')
const CSON = require('@rokt33r/season')
const { findStorage } = require('browser/lib/findStorage')

/**
 * @param {String} storageKey
 * @param {Object} folders
 */
function updateFolders(storageKey, folders) {
  let targetStorage
  try {
    if (folders == null) throw new Error('No input folders.')
    // if (!_.isString(input.name)) throw new Error('Name must be a string.')
    // if (!_.isString(input.color)) throw new Error('Color must be a string.')

    targetStorage = findStorage(storageKey)
  } catch (e) {
    return Promise.reject(e)
  }

  return resolveStorageData(targetStorage).then(function updateFolder(storage) {
    storage.folders = folders
    CSON.writeFileSync(
      path.join(storage.path, 'boostnote.json'),
      _.pick(storage, ['folders', 'version'])
    )

    return {
      storage
    }
  })
}

module.exports = updateFolders
