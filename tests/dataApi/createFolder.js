const test = require('ava')
const createFolder = require('browser/main/lib/dataApi/createFolder')
const sander = require('sander')

global.document = require('jsdom').jsdom('<body></body>')
global.window = document.defaultView
global.navigator = window.navigator

const Storage = require('dom-storage')
const localStorage = window.localStorage = global.localStorage = new Storage(null, { strict: true })
const path = require('path')
const crypto = require('crypto')
const _ = require('lodash')

function copyFile (filePath, targetPath) {
  return sander.readFile(filePath)
    .then(function writeFile (data) {
      return sander.writeFile(targetPath, data.toString())
    })
}

const dummyStoragePath = path.join(__dirname, '..', 'dummy/dummyStorage')
const targetPath = path.join(__dirname, '../sandbox/test-add-folder')
const dummyRawStorage = {
  name: 'test1',
  key: crypto.randomBytes(6).toString('hex'),
  path: targetPath
}
test.before(function () {
  localStorage.setItem('storages', JSON.stringify([dummyRawStorage]))

  return copyFile(path.join(dummyStoragePath, 'boostnote.json'), path.join(targetPath, 'boostnote.json'))
})
const input = {
  name: 'test folder',
  color: '#FF5555'
}

test('Add note to storage', (t) => {
  return createFolder(dummyRawStorage.key, input)
    .then(function assert (data) {
      t.not(data.storage, null)

      let targetFolder = _.find(data.storage.folders, {
        name: input.name,
        color: input.color
      })

      t.not(targetFolder, null)

      t.true(sander.statSync(path.join(targetPath, targetFolder.key)).isDirectory())
    })
})

test.after.always(function () {
  localStorage.clear()
  sander.rimrafSync(targetPath)
})
