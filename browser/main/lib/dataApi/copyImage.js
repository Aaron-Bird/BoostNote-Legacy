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
      const imageExt = path.extname(filePath)
      const imageName = Math.random().toString(36).slice(-16)
      const basename = `${imageName}${imageExt}`
      const imageDir = path.join(targetStorage.path, 'images')
      if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir)
      const outputImage = fs.createWriteStream(path.join(imageDir, basename))
      inputImage.pipe(outputImage)
      resolve(basename)
    } catch (e) {
      return reject(e)
    }
  })
}

module.exports = copyImage
