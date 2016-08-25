const _ = require('lodash')
const keygen = require('browser/lib/keygen')
const sander = require('sander')
const path = require('path')

const defaultBoostnoteJSON = {
  folders: []
}

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

  const boostnoteJSONPath = path.join(newStorage.path, 'boostnote.json')

  return Promise.resolve(newStorage)
    .then(function resolveBoostnoteJSON () {
      return sander.readFile(boostnoteJSONPath)
        .then(function checkBoostnoteJSONExists (data) {
          let parsedData = JSON.parse(data.toString())
          if (!_.isArray(parsedData.folders)) throw new Error('`folders` must be array.')

          newStorage.folders = parsedData.folders
            .filter(function takeOnlyValidKey (folder) {
              return _.isString(folder.key)
            })
          return newStorage
        })
        .catch(function tryToRewriteNewBoostnoteJSON (err) {
          return sander
            .writeFile(boostnoteJSONPath, JSON.stringify(defaultBoostnoteJSON))
            .then(function () {
              newStorage.folders = defaultBoostnoteJSON.folders
              return newStorage
            })
        })
    })
    .then(function saveMetadataToLocalStorage () {
      rawStorages.push({
        key: newStorage.key,
        type: newStorage.type,
        name: newStorage.name,
        path: newStorage.path
      })

      localStorage.setItem('storages', JSON.stringify(rawStorages))
    })
    .then(function fetchNotes () {
      var folderNotes = newStorage.folders
        .map(function fetchNotesFromEachFolder (folder) {
          var folderDataJSONPath = path.join(newStorage.path, folder.key, 'data.json')
          return sander.readFile(folderDataJSONPath)
            .then(function parseData (rawData) {
              return JSON.parse(rawData)
            })
            .then(function validateNotes (data) {
              if (!_.isArray(data.notes)) throw new Error('Invalid data.json')
              return data.notes
                .map(function (note) {
                  note.folder = folder.key
                  note.storage = newStorage.key
                  return note
                })
            })
            .catch(function rewriteNotes (err) {
              console.error(err)
              return []
            })
        })
      return Promise.all(folderNotes)
        .then(function reduceFolderNotes (folderNotes) {
          return folderNotes.reduce(function (sum, notes) {
            return sum.concat(notes)
          }, [])
        })
    })
    .then(function returnValue (notes) {
      return {
        storage: newStorage,
        notes
      }
    })
}

module.exports = addStorage
