const test = require('ava')
const init = require('browser/main/lib/dataApi/init')

global.document = require('jsdom').jsdom('<body></body>')
global.window = document.defaultView
global.navigator = window.navigator

const Storage = require('dom-storage')
const localStorage = window.localStorage = global.localStorage = new Storage(null, { strict: true })
const path = require('path')
const crypto = require('crypto')

test.serial('Fetch storages and notes', (t) => {
  const dummyStoragePath = path.join(__dirname, '..', 'dummy/dummyStorage')
  const dummyRawStorage = {
    name: 'test1',
    key: crypto.randomBytes(6).toString('hex'),
    path: dummyStoragePath
  }
  const dummyFolderKey = 'fc6ba88e8ecf'

  return Promise.resolve()
    .then(function before () {
      localStorage.setItem('storages', JSON.stringify([dummyRawStorage]))
    })
    .then(function test () {
      return init()
    })
    .then(function assert (data) {
      t.true(Array.isArray(data.storages))
      var targetStorage = data.storages.filter((storage) => storage.key === dummyRawStorage.key)[0]
      t.not(targetStorage, null)
      t.is(targetStorage.name, dummyRawStorage.name)
      t.is(targetStorage.key, dummyRawStorage.key)
      t.is(targetStorage.path, dummyRawStorage.path)
      t.is(data.notes.length, 2)
      data.notes.forEach((note) => {
        t.is(note.folder, dummyFolderKey)
      })

      t.true(Array.isArray(data.notes))
    })
    .then(function after () {
      localStorage.clear()
    })
})

test.serial('If storage path is a empty folder, return metadata with empty folder array and empty note array.', (t) => {
  const emptyFolderPath = path.join(__dirname, '..', 'dummy/empty')
  const dummyRawStorage = {
    name: 'test2',
    key: crypto.randomBytes(6).toString('hex'),
    path: emptyFolderPath
  }
  return Promise.resolve()
    .then(function before () {
      localStorage.setItem('storages', JSON.stringify([dummyRawStorage]))
    })
    .then(function test () {
      return init()
    })
    .then(function assert (data) {
      t.true(Array.isArray(data.storages))
      var targetStorage = data.storages.filter((storage) => storage.key === dummyRawStorage.key)[0]
      t.not(targetStorage, null)
      t.is(targetStorage.name, dummyRawStorage.name)
      t.is(targetStorage.key, dummyRawStorage.key)
      t.is(targetStorage.path, dummyRawStorage.path)

      t.true(Array.isArray(data.notes))
    })
    .then(function after () {
      localStorage.clear()
    })
})
