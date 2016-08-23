const test = require('ava')
const init = require('browser/main/lib/dataApi/init')

global.document = require('jsdom').jsdom('<body></body>')
global.window = document.defaultView
global.navigator = window.navigator

const Storage = require('dom-storage')
const localStorage = window.localStorage = global.localStorage = new Storage(null, { strict: true })
const sander = require('sander')
const path = require('path')
const crypto = require('crypto')

const dummyStoragePath = path.join(__dirname, '..', 'sandbox')
const dummyRawStorage = {
  name: 'test',
  key: crypto.randomBytes(6).toString('hex'),
  path: dummyStoragePath
}

test.serial('fetch storages and notes', (t) => {
  const boostnoteJSONPath = path.join(dummyStoragePath, 'boostnote.json')
  const dummyFolderKey = crypto.randomBytes(6).toString('hex')
  const dummyFolders = [{
    key: dummyFolderKey,
    name: 'test1',
    color: '#f55'
  }]
  const dummyFolderDataJSONPath = path.join(dummyStoragePath, dummyFolderKey, 'data.json')
  const dummyNotesJSONString = sander.readFileSync(path.join(__dirname, '../dummy/data.json'))

  return Promise.resolve()
    .then(function before () {
      localStorage.setItem('storages', JSON.stringify([dummyRawStorage]))
      sander.writeFileSync(boostnoteJSONPath, JSON.stringify({folders: dummyFolders}))
      sander.writeFileSync(dummyFolderDataJSONPath, dummyNotesJSONString)
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
      sander.unlinkSync(boostnoteJSONPath)
      sander.unlinkSync(dummyFolderDataJSONPath)
    })
})

test.serial('Fetch storages. case: storage folder doesnt exist.', (t) => {
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
