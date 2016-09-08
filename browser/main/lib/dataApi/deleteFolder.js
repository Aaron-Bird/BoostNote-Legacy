const _ = require('lodash')
const path = require('path')
const resolveStorageData = require('./resolveStorageData')
const resolveStorageNotes = require('./resolveStorageNotes')
const CSON = require('season')
const sander = require('sander')

/**
 * @param {String} storageKey
 * @param {String} folderKey
 *
 * @return {Object}
 * ```
 * {
 *   storage: Object,
 *   folderKey: String
 * }
 * ```
 */
function deleteFolder (storageKey, folderKey) {
  let rawStorages
  let targetStorage
  try {
    rawStorages = JSON.parse(localStorage.getItem('storages'))
    if (!_.isArray(rawStorages)) throw new Error('Target storage doesn\'t exist.')

    targetStorage = _.find(rawStorages, {key: storageKey})
    if (targetStorage == null) throw new Error('Target storage doesn\'t exist.')
  } catch (e) {
    return Promise.reject(e)
  }

  return resolveStorageData(targetStorage)
    .then(function assignNotes (storage) {
      return resolveStorageNotes(storage)
        .then((notes) => {
          return {
            storage,
            notes
          }
        })
    })
    .then(function deleteFolderAndNotes (data) {
      let { storage, notes } = data
      storage.folders = storage.folders
        .filter(function excludeTargetFolder (folder) {
          return folder.key !== folderKey
        })

      let targetNotes = notes.filter(function filterTargetNotes (note) {
        return note.folder === folderKey
      })

      let deleteAllNotes = targetNotes
        .map(function deleteNote (note) {
          const notePath = path.join(storage.path, 'notes', note.key + '.cson')
          return sander.unlink(notePath)
            .catch(function (err) {
              console.warn('Failed to delete', notePath, err)
            })
        })
      return Promise.all(deleteAllNotes)
        .then(() => storage)
    })
    .then(function (storage) {
      CSON.writeFileSync(path.join(storage.path, 'boostnote.json'), _.pick(storage, ['folders', 'version']))

      return {
        storage,
        folderKey
      }
    })
}

module.exports = deleteFolder
