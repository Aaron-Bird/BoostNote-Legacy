const test = require('ava')
const removeStorage = require('browser/main/lib/dataApi/removeStorage')

global.document = require('jsdom').jsdom('<body></body>')
global.window = document.defaultView
global.navigator = window.navigator

const Storage = require('dom-storage')
const localStorage = window.localStorage = global.localStorage = new Storage(null, { strict: true })
const path = require('path')
const crypto = require('crypto')

test('Remove a storage', (t) => {
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
      return removeStorage(dummyStorageKey)
    })
    .then(function assert (data) {
      t.is(JSON.parse(localStorage.getItem('storages')).length, 0)
    })
})

test.after(function after () {
  localStorage.clear()
})
