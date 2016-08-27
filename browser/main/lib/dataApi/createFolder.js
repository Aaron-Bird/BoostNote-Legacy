const _ = require('lodash')
const keygen = require('browser/lib/keygen')
const path = require('path')
const resolveStorageData = require('./resolveStorageData')
const CSON = require('season')

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
 * @return {Object}
 * ```
 * {
 *   storage: Object
 * }
 * ```
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

  return resolveStorageData(targetStorage)
    .then(function createFolder (storage) {
      let key = keygen()
      while (storage.folders.some((folder) => folder.key === key)) {
        key = keygen()
      }
      let newFolder = {
        key,
        color: input.color,
        name: input.name
      }

      storage.folders.push(newFolder)

      CSON.writeFileSync(path.join(storage.path, 'boostnote.json'), _.pick(storage, ['folders', 'version']))

      return {
        storage
      }
    })
}

module.exports = createFolder
