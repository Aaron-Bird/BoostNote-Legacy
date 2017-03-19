const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const sander = require('sander')

/**
 * @description To copy an image and return the path.
 * @param {String} filePath
 * @param {String} storageKey
 * @return {String} an image path
 */
function copyImage (filePath, storageKey) {
  return new Promise((resolve, reject) => {
    try {
      const cachedStorageList = JSON.parse(localStorage.getItem('storages'))
      if (!_.isArray(cachedStorageList)) throw new Error('Target storage doesn\'t exist.')
      const storage = _.find(cachedStorageList, {key: storageKey})
      if (storage === undefined) throw new Error('Target storage doesn\'t exist.')
      const targetStorage = storage

      const inputImage = fs.createReadStream(filePath)
      const imageName = path.basename(filePath)
      const outputImage = fs.createWriteStream(path.join(targetStorage.path, 'images', imageName))
      inputImage.pipe(outputImage)
      resolve(`${encodeURI(targetStorage.path)}/images/${encodeURI(imageName)}`)
    } catch (e) {
      return reject(e)
    }
  })
}

module.exports = copyImage
