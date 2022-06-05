const _ = require('lodash')
const keygen = require('browser/lib/keygen')
const path = require('path')
const resolveStorageData = require('./resolveStorageData')
const CSON = require('@rokt33r/season')
const { findStorage } = require('browser/lib/findStorage')

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
function createFolder(storageKey, input, parent) {
  let targetStorage
  try {
    if (input == null) throw new Error('No input found.')
    if (!_.isString(input.name)) throw new Error('Name must be a string.')
    if (!_.isString(input.color)) throw new Error('Color must be a string.')

    targetStorage = findStorage(storageKey)
  } catch (e) {
    return Promise.reject(e)
  }

  return resolveStorageData(targetStorage).then(function createFolder(storage) {
    let key = keygen()
    while (storage.folders.some(folder => folder.key === key)) {
      key = keygen()
    }

    const newFolder = {
      key,
      color: input.color,
      name: input.name,
      children: [],
      parent: parent && parent.key
    }

    storage.folders.push(newFolder)
    if (parent) {
      const parentKey = parent.key
      const newParentFolder = storage.folders.some(folder => {
        if (folder.key === parentKey) {
          if (!folder.children) folder.children = []
          folder.children.push(key)
          return true
        }
      })
      if (!newParentFolder) {
        throw new Error('未找到父文件夹!')
      }
    }

    CSON.writeFileSync(
      path.join(storage.path, 'boostnote.json'),
      _.pick(storage, ['folders', 'version'])
    )

    return {
      storage
    }
  })
}

module.exports = createFolder
