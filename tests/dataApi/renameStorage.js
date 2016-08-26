const test = require('ava')
const renameStorage = require('browser/main/lib/dataApi/renameStorage')

global.document = require('jsdom').jsdom('<body></body>')
global.window = document.defaultView
global.navigator = window.navigator

const Storage = require('dom-storage')
const localStorage = window.localStorage = global.localStorage = new Storage(null, { strict: true })
const path = require('path')
const crypto = require('crypto')
const _ = require('lodash')

test('Rename a storage', (t) => {
  const dummyStoragePath = path.join(__dirname, '..', 'dummy/dummyStorage')
  const dummyStorageKey = crypto.randomBytes(6).toString('hex')
  const dummyRawStorage = {
    name: 'test1',
    key: dummyStorageKey,
    path: dummyStoragePath
  }

  return Promise.resolve()
    .then(function before () {
      localStorage.setItem('storages', JSON.stringify([dummyRawStorage]))
    })
    .then(function test () {
      return renameStorage(dummyStorageKey, 'test2')
    })
    .then(function assert (data) {
      let rawStorages = JSON.parse(localStorage.getItem('storages'))
      t.true(_.find(rawStorages, {key: dummyStorageKey}).name === 'test2')
    })
})

test.after(function after () {
  localStorage.clear()
})
