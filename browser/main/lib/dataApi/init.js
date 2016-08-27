'use strict'
const _ = require('lodash')
const resolveStorageData = require('./resolveStorageData')
const resolveStorageNotes = require('./resolveStorageNotes')
/**
 * @return {Object} all storages and notes
 * ```
 * {
 *   storages: [...],
 *   notes: [...]
 * }
 * ```
 *
 * This method deals with 3 patterns.
 * 1. v1
 * 2. legacy
 * 3. empty directory
 */
function init () {
  let fetchStorages = function () {
    let rawStorages
    try {
      rawStorages = JSON.parse(window.localStorage.getItem('storages'))
      if (!_.isArray(rawStorages)) throw new Error('Cached data is not valid.')
    } catch (e) {
      console.warn('Failed to parse cached data from localStorage', e)
      rawStorages = []
      window.localStorage.setItem('storages', JSON.stringify(rawStorages))
    }
    return Promise.all(rawStorages
      .map(resolveStorageData))
  }

  let fetchNotes = function (storages) {
    let findNotesFromEachStorage = storages
      .map(resolveStorageNotes)
    return Promise.all(findNotesFromEachStorage)
      .then(function concatNoteGroup (noteGroups) {
        return noteGroups.reduce(function (sum, group) {
          return sum.concat(group)
        }, [])
      })
      .then(function returnData (notes) {
        return {
          storages,
          notes
        }
      })
  }

  return Promise.resolve(fetchStorages())
    .then((storages) => {
      return storages
        .filter((storage) => {
          if (!_.isObject(storage)) return false
          return true
        })
    })
    .then(fetchNotes)
}
module.exports = init
