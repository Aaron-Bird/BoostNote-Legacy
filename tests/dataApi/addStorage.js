const test = require('ava')
const addStorage = require('browser/main/lib/dataApi/addStorage')

global.document = require('jsdom').jsdom('<body></body>')
global.window = document.defaultView
global.navigator = window.navigator

const Storage = require('dom-storage')
const localStorage = window.localStorage = global.localStorage = new Storage(null, { strict: true })
const path = require('path')
const sander = require('sander')
const _ = require('lodash')

function copyFile (filePath, targetPath) {
  return sander.readFile(filePath)
    .then(function writeFile (data) {
      return sander.writeFile(targetPath, data.toString())
    })
}

test('add a initialized storage', (t) => {
  const dummyStoragePath = path.join(__dirname, '../dummy/dummyStorage')
  const targetPath = path.join(__dirname, '../sandbox/test-add-storage1')
  const input = {
    type: 'FILESYSTEM',
    name: 'test-add-storage1',
    path: targetPath
  }
  return Promise.resolve()
    .then(function before () {
      localStorage.setItem('storages', JSON.stringify([]))

      sander.rimrafSync(targetPath)
      return copyFile(path.join(dummyStoragePath, 'boostnote.json'), path.join(targetPath, 'boostnote.json'))
        .then(() => {
          return copyFile(path.join(dummyStoragePath, 'fc6ba88e8ecf/data.json'), path.join(targetPath, 'fc6ba88e8ecf/data.json'))
        })
    })
    .then(function doTest (data) {
      return addStorage(input)
    })
    .then(function validateResult (data) {
      const { storage, notes } = data

      t.true(_.isString(storage.key))
      t.is(storage.name, 'test-add-storage1')
      t.true(_.isArray(storage.folders))
      t.is(storage.folders.length, 1)
      t.true(_.isArray(notes))
      t.is(notes.length, 2)
      t.is(notes[0].folder, 'fc6ba88e8ecf')
      t.is(notes[0].storage, storage.key)
    })
    .then(function after () {
      localStorage.clear()
      sander.rimrafSync(targetPath)
    })
})

test('add a fresh storage', (t) => {
  const targetPath = path.join(__dirname, '../sandbox/test-add-storage2')
  const input = {
    type: 'FILESYSTEM',
    name: 'test-add-storage2',
    path: targetPath
  }
  return Promise.resolve()
    .then(function before () {
      localStorage.setItem('storages', JSON.stringify([]))

      sander.rimrafSync(targetPath)
    })
    .then(function doTest (data) {
      return addStorage(input)
    })
    .then(function validateResult (data) {
      const { storage, notes } = data

      t.true(_.isString(storage.key))
      t.is(storage.name, 'test-add-storage2')
      t.true(_.isArray(storage.folders))
      t.is(storage.folders.length, 0)

      t.true(_.isArray(notes))
      t.is(notes.length, 0)

      t.true(sander.statSync(path.join(targetPath, 'boostnote.json')).isFile())
    })
    .then(function after () {
      localStorage.clear()
      sander.rimrafSync(targetPath)
    })
})
