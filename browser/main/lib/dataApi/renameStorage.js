const _ = require('lodash')

/**
 * @param {String} key
 * @param {String} name
 * @return {Object} Storage meta data
 */
function renameStorage (key, name) {
  if (!_.isString(name)) return Promise.reject(new Error('Name must be a string.'))

  let rawStorages
  try {
    rawStorages = JSON.parse(localStorage.getItem('storages'))
    if (!_.isArray(rawStorages)) throw new Error('invalid storages')
  } catch (e) {
    console.warn(e)
    rawStorages = []
  }

  let targetStorage
  for (let i = 0; i < rawStorages.length; i++) {
    if (rawStorages[i].key === key) {
      rawStorages[i].name = name
      targetStorage = rawStorages[i]
    }
  }

  localStorage.setItem('storages', JSON.stringify(rawStorages))

  return Promise.resolve(targetStorage)
}

module.exports = renameStorage
