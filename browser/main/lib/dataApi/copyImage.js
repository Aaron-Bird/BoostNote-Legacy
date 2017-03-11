const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const sander = require('sander')

function copyImage (filePath, storageKey) {
  let targetStorage
  try {
    let cachedStorageList = JSON.parse(localStorage.getItem('storages'))
    if (!_.isArray(cachedStorageList)) throw new Error('Target storage doesn\'t exist.')

    targetStorage = _.find(cachedStorageList, {key: storageKey})
    if (targetStorage == null) throw new Error('Target storage doesn\'t exist.')
  } catch (e) {
    return Promise.reject(e)
  }

  //return resolveStorageData(targetStorage)

  const inputImage = fs.createReadStream(filePath)
  const imageName = path.basename(filePath)
  sander.mkdirSync(`${targetStorage.path}/images`)
  const outputImage = fs.createWriteStream(path.join(targetStorage.path, 'images', imageName))
  inputImage.pipe(outputImage)
}

module.exports = copyImage
