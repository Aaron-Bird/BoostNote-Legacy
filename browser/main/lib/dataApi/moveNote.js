const resolveStorageData = require('./resolveStorageData')
const _ = require('lodash')
const path = require('path')
const CSON = require('@rokt33r/season')
const keygen = require('browser/lib/keygen')
const sander = require('sander')

function moveNote (storageKey, noteKey, newStorageKey, newFolderKey) {
  let oldStorage, newStorage
  try {
    let cachedStorageList = JSON.parse(localStorage.getItem('storages'))
    if (!_.isArray(cachedStorageList)) throw new Error('Storage doesn\'t exist.')

    oldStorage = _.find(cachedStorageList, {key: storageKey})
    if (oldStorage == null) throw new Error('Storage doesn\'t exist.')

    newStorage = _.find(cachedStorageList, {key: newStorageKey})
    if (newStorage == null) throw new Error('Target storage doesn\'t exist.')
  } catch (e) {
    return Promise.reject(e)
  }

  return resolveStorageData(oldStorage)
    .then(function saveNote (_oldStorage) {
      oldStorage = _oldStorage
      let noteData
      let notePath = path.join(oldStorage.path, 'notes', noteKey + '.cson')
      try {
        noteData = CSON.readFileSync(notePath)
      } catch (err) {
        console.warn('Failed to find note cson', err)
        throw err
      }
      let newNoteKey
      return Promise.resolve()
        .then(function resolveNewStorage () {
          if (storageKey === newStorageKey) {
            newNoteKey = noteKey
            return oldStorage
          }
          return resolveStorageData(newStorage)
            .then(function findNewNoteKey (_newStorage) {
              newStorage = _newStorage
              newNoteKey = keygen()
              let isUnique = false
              while (!isUnique) {
                try {
                  sander.statSync(path.join(newStorage.path, 'notes', newNoteKey + '.cson'))
                  newNoteKey = keygen()
                } catch (err) {
                  if (err.code === 'ENOENT') {
                    isUnique = true
                  } else {
                    throw err
                  }
                }
              }

              return newStorage
            })
        })
        .then(function checkFolderExistsAndPrepareNoteData (newStorage) {
          if (_.find(newStorage.folders, {key: newFolderKey}) == null) throw new Error('Target folder doesn\'t exist.')

          noteData.folder = newFolderKey
          noteData.key = newNoteKey
          noteData.storage = newStorageKey
          noteData.updatedAt = new Date()

          return noteData
        })
        .then(function writeAndReturn (noteData) {
          CSON.writeFileSync(path.join(newStorage.path, 'notes', noteData.key + '.cson'), _.omit(noteData, ['key', 'storage']))
          return noteData
        })
        .then(function deleteOldNote (data) {
          if (storageKey !== newStorageKey) {
            try {
              sander.unlinkSync(path.join(oldStorage.path, 'notes', noteKey + '.cson'))
            } catch (err) {
              console.warn(err)
            }
          }

          return data
        })
    })
}

module.exports = moveNote
