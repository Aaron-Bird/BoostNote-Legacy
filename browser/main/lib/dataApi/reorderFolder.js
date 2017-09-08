const _ = require('lodash')
_.move = require('lodash-move').default
const path = require('path')
const resolveStorageData = require('./resolveStorageData')
const CSON = require('@rokt33r/season')

/**
 * @param {String} storageKey
 * @param {number} oldIndex
 * @param {number} newIndex
 *
 * @return {Object}
 * ```
 * {
 *   storage: Object
 * }
 * ```
 */
function reorderFolder (storageKey, oldIndex, newIndex) {
  let rawStorages
  let targetStorage
  try {
    if (!_.isNumber(oldIndex)) throw new Error('oldIndex must be a number.')
    if (!_.isNumber(newIndex)) throw new Error('newIndex must be a number.')

    rawStorages = JSON.parse(localStorage.getItem('storages'))
    if (!_.isArray(rawStorages)) throw new Error('Target storage doesn\'t exist.')

    targetStorage = _.find(rawStorages, {key: storageKey})
    if (targetStorage == null) throw new Error('Target storage doesn\'t exist.')
  } catch (e) {
    return Promise.reject(e)
  }

  return resolveStorageData(targetStorage)
    .then(function reorderFolder (storage) {
      storage.folders = _.move(storage.folders, oldIndex, newIndex)
      CSON.writeFileSync(path.join(storage.path, 'boostnote.json'), _.pick(storage, ['folders', 'version']))

      return {
        storage
      }
    })
}

module.exports = reorderFolder
