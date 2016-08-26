'use strict'
const _ = require('lodash')
const sander = require('sander')
const path = require('path')

/**
 * @return {Object} all storages and notes
 * ```
 * {
 *   storages: [...],
 *   notes: [...]
 * }
 * ```
 */
function init () {
  let fetchStorages = function () {
    let rawStorages
    try {
      rawStorages = JSON.parse(window.localStorage.getItem('storages'))
      if (!_.isArray(rawStorages)) throw new Error('Cached data is not valid.')
    } catch (e) {
      console.error(e)
      rawStorages = []
      window.localStorage.setItem('storages', JSON.stringify(rawStorages))
    }
    return Promise.all(rawStorages
      .map(function assignFoldersToStorage (rawStorage) {
        let data
        let boostnoteJSONPath = path.join(rawStorage.path, 'boostnote.json')
        try {
          data = JSON.parse(sander.readFileSync(boostnoteJSONPath))
          if (!_.isArray(data.folders)) throw new Error('folders should be an array.')
          rawStorage.folders = data.folders
        } catch (err) {
          if (err.code === 'ENOENT') {
            console.warn('boostnote.json file doesn\'t exist the given path')
          } else {
            console.error(err)
          }
          rawStorage.folders = []
        }
        return Promise.resolve(rawStorage)
      }))
  }

  let fetchNotes = function (storages) {
    let notes = []

    storages
      .forEach((storage) => {
        storage.folders.forEach((folder) => {
          let dataPath = path.join(storage.path, folder.key, 'data.json')
          let data
          try {
            data = JSON.parse(sander.readFileSync(dataPath))
            if (!_.isArray(data.notes)) throw new Error('notes should be an array.')
          } catch (e) {
            // Remove folder if fetching failed.
            console.error('Failed to load data: %s', dataPath)
            storage.folders = storage.folders.filter((_folder) => _folder.key !== folder.key)
            data = {notes: []}
          }
          data.notes.forEach((note) => {
            note.storage = storage.key
            note.folder = folder.key
            notes.push(note)
          })
        })
      })
    return Promise.resolve({
      storages,
      notes
    })
  }

  return Promise.resolve(fetchStorages())
    .then((storages) => {
      storages = storages.filter((storage) => {
        if (!_.isObject(storage)) return false
        return true
      })
      return storages
    })
    .then(fetchNotes)
}
module.exports = init
