const resolveStorageData = require('./resolveStorageData')
const _ = require('lodash')
const path = require('path')
const sander = require('sander')

function deleteNote (storageKey, noteKey) {
  let targetStorage
  try {
    let cachedStorageList = JSON.parse(localStorage.getItem('storages'))
    if (!_.isArray(cachedStorageList)) throw new Error('Target storage doesn\'t exist.')

    targetStorage = _.find(cachedStorageList, {key: storageKey})
    if (targetStorage == null) throw new Error('Target storage doesn\'t exist.')
  } catch (e) {
    return Promise.reject(e)
  }

  return resolveStorageData(targetStorage)
    .then(function deleteNoteFile (storage) {
      let notePath = path.join(storage.path, 'notes', noteKey + '.cson')

      try {
        sander.unlinkSync(notePath)
      } catch (err) {
        console.warn('Failed to delete note cson', err)
      }
      return {
        noteKey,
        storageKey
      }
    })
}

module.exports = deleteNote
