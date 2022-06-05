const _ = require('lodash')
const path = require('path')
const resolveStorageData = require('./resolveStorageData')
const resolveStorageNotes = require('./resolveStorageNotes')
const CSON = require('@rokt33r/season')
const { findStorage } = require('browser/lib/findStorage')
const deleteSingleNote = require('./deleteNote')

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
function deleteFolder(storageKey, folderKey) {
  let targetStorage
  try {
    targetStorage = findStorage(storageKey)
  } catch (e) {
    return Promise.reject(e)
  }

  return resolveStorageData(targetStorage)
    .then(function assignNotes(storage) {
      return resolveStorageNotes(storage).then(notes => {
        return {
          storage,
          notes
        }
      })
    })
    .then(function deleteFolderAndNotes(data) {
      const { storage, notes } = data

      const folder = storage.folders.find(folder => folder.key === folderKey)
      const deleteFolderKeys = [folder.key]
      let index = 0
      while (index < deleteFolderKeys.length) {
        const key = deleteFolderKeys[index]
        const folder = storage.folders.find(folder => folder.key === key)
        if (Array.isArray(folder.children)) {
          deleteFolderKeys.push(...folder.children)
        }
        index++
      }
      const folders = storage.folders.filter(function excludeTargetFolder(
        folder
      ) {
        return !deleteFolderKeys.includes(folder.key)
      })
      folders.forEach(folder => {
        if (Array.isArray(folder.children)) {
          folder.children = folder.children.filter(childrenFolderKey => {
            return !deleteFolderKeys.includes(childrenFolderKey)
          })
        }
      })

      const targetNotes = notes.filter(function filterTargetNotes(note) {
        return deleteFolderKeys.includes(note.folder)
      })
      const deleteAllNotes = targetNotes.map(function deleteNote(note) {
        return deleteSingleNote(storageKey, note.key)
      })

      return Promise.all(deleteAllNotes).then(() => {
        storage.folders = folders
        storage.notes = notes.filter(function filterTargetNotes(note) {
          return !deleteFolderKeys.includes(note.folder)
        })
        return [storage, deleteFolderKeys]
      })
    })
    .then(function([storage, deleteFolderKeys]) {
      CSON.writeFileSync(
        path.join(storage.path, 'boostnote.json'),
        _.pick(storage, ['folders', 'version'])
      )

      return {
        storage,
        folderKey,
        deleteFolderKeys: deleteFolderKeys
      }
    })
}

module.exports = deleteFolder
