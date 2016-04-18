const keygen = require('browser/lib/keygen')
const fs = require('fs')
const path = require('path')
const CSON = require('season')
const _ = require('lodash')

/**
 * # Repo structure
 *
 * ```
 * root
 *  |- data
 *      |-note1.cson
 *      |-note2.cson
 *      |-note3.cson
 *  |- boostrepo.json
 * ```
 *
 * ## `boostrepo.json`
 *
 * ```js
 * {
 *   name: String,
 *   author: String, // Same convention of package.json, `John Doe <email@example.com> (http://example.com)`
 *   remotes: [{
 *     name: String,
 *     url: String, // url of git remote
 *     branch: String // if branch isn't set, it will try to use `master` branch.
 *   }],
 *   folders: [{
 *     key: String // Unique sha1 hash key to identify folder,
 *     name: String,
 *     color: String // All CSS color formats available.
 *   }]
 * }
 * ```
 *
 * ## `data` directory
 *
 * Every note will be saved here as a single CSON file to `git diff` efficiently.
 * > This is because CSON supports Multiline string.
 * File name of each cson file will be used to identify note.
 * Commonly, Boostnote will automatically generate sha1 key and use it as a file name when creating a new note.
 *
 * ### `note.cson`
 *
 * ```cson
 * name: String
 * tags: [String] // tags
 * folder: String // hash key of folder
 * mode: String // syntax mode
 * title: String
 * content: String
 * createdAt: Date
 * updatedAt: Date
 * ```
 */

/**
 * # Resolve directory.
 *
 * If directory doesn't exist, it will try to make a new one.
 * If failed return rejected promise
 *
 * @param  {String} targetPath Target path of directory
 * @return {Promise}      [description]
 */
function _resolveDirectory (targetPath) {
  return new Promise(function (resolve, reject) {
    // check the directory exists
    fs.stat(targetPath, function (err, stat) {
      // Reject errors except no suchfile
      if (err != null && err.code !== 'ENOENT') {
        return reject(err)
      }

      // Handle no suchfile error only
      // Make new Folder by given path
      if (err != null) {
        return fs.mkdir(targetPath, function (err, stat) {
          // If failed to make a new directory, reject it.
          if (err != null) {
            return reject(err)
          }
          resolve(targetPath)
        })
      }

      // Check the target is not a directory
      if (!stat.isDirectory()) {
        return reject(new Error(targetPath + ' path is not a directory'))
      }
      resolve(targetPath)
    })
  })
}

function _generateDefaultRepoJSON (override) {
  return Object.assign({
    name: 'default',
    remotes: [],
    folders: [{
      key: keygen(),
      name: 'general',
      color: 'green'
    }]
  }, override)
}

/**
 * # Resolve RepoJSON
 *
 * Every repository must have `boostrepo.json`
 *
 * If boostrepo.json doesn't exist, create new one.
 *
 * @param  {[type]} targetPath [description]
 * @return {[type]}            [description]
 */
function _resolveRepoJSON (targetPath) {
  return new Promise(function checkIfExists (resolve, reject) {
    // If JSON doesn't exist, make a new one.
    if (CSON.resolve(targetPath) == null) {
      let newRepoJSON = _generateDefaultRepoJSON()
      return CSON.writeFile(targetPath, newRepoJSON, function (err) {
        if (err != null) return reject(err)
        resolve(newRepoJSON)
      })
    }

    CSON.readFile(targetPath, function (err, obj) {
      if (err != null) return reject(err)
      resolve(obj)
    })
  })
}

/**
 * Get all repository stats from localStorage
 * it is stored to `repositories` key.
 * if the data is corrupted, re-intialize it.
 *
 * @return {Array} registered repositories
 * ```
 * [{
 *   key: String,
 *   name: String,
 *   path: String // path of repository
 * }]
 * ```
 */
function getAllRepoStats () {
  let data
  try {
    data = JSON.parse(localStorage.getItem('repositories'))
    if (!_.isArray(data)) {
      throw new Error('Data is corrupted. it must be an array.')
    }
  } catch (err) {
    console.log(err)
    data = []
    _saveAllRepoStats(data)
  }
  return data
}

/**
 * Save All Repos
 */
function _saveAllRepoStats (repoStats) {
  localStorage.setItem('repoStats', JSON.stringify(repoStats))
}

/**
 * Add repository and return new Repo
 * @param {Object} newRepo [description]
 * ```
 * {
 *   key: String,
 *   name: String,
 *   path: String,
 *   status: String,
 *   folders: [{
 *     key: String,
 *     color: String,
 *     name: String
 *   }],
 *   notes: [{
 *     key: String,
 *     title: String,
 *     content: String,
 *     folder: String,
 *     tags: [String],
 *     createdAt: Date,
 *     updatedAt: Date
 *   }]
 * }
 * ```
 */
function addRepo (newRepo) {
  let { targetPath, name } = newRepo
  targetPath = path.resolve(targetPath)

  let repoStat, repoJSON
  return _resolveDirectory(targetPath)
    .then(function initializeRepo () {
      let resolveDataDirectory = _resolveDirectory(path.resolve(targetPath, 'data'))
      let resolveBoostrepoJSON = _resolveRepoJSON(path.resolve(targetPath, 'boostrepo.json'))
      return Promise.all([resolveDataDirectory, resolveBoostrepoJSON])
    })
    .then(function setLoalStorage (data) {
      let dataPath = data[0]
      repoJSON = data[1]

      let repoStats = getAllRepoStats()

      // generate unique key
      let key = keygen()
      while (repoStats.some((repoStat) => repoStat.key === key)) {
        key = keygen()
      }

      repoStat = {
        key,
        name: name,
        path: targetPath
      }

      repoStats.push(repoStat)
      _saveAllRepoStats(repoStats)

      return dataPath
    })
    .then(function fetchNotes (dataPath) {
      let noteNames = fs.readdirSync(dataPath)
      let notes = noteNames
        .map((noteName) => {
          let notePath = path.resolve(dataPath, noteNames)

          return new Promise(function (resolve, reject) {
            CSON.readFile(notePath, function (err, obj) {
              if (err != null) {
                console.log(err)
                return resolve(null)
              }
              obj.key = path.basename(noteName, '.cson')
              return resolve(obj)
            })
          })
        })
        .filter((note) => note != null)

      return Promise.all(notes)
    })
    .then(function resolveRepo (notes) {
      return Object.assign({}, repoJSON, repoStat, {
        status: 'IDLE',
        notes
      })
    })
}

function getRepos () {
  let repoStats
  try {
    repoStats = JSON.parse(localStorage.getItem('repoStats'))
    if (repoStats == null) repoStats = []
  } catch (err) {
    repoStats = []
  }
  return repoStats
    .map((repoStat) => {
      let repoJSON, notes
      try {
        repoJSON = CSON.readFileSync(path.resolve(repoStat.path, 'boostrepo.json'))
        let notePaths = fs.readdirSync(path.resolve(repoStat.path, 'data'))
        notes = notePaths.map((notePath) => CSON.readFileSync(notePath))
      } catch (err) {
        return Object.assign({}, repoStat, {
          status: 'ERROR',
          error: err
        })
      }
      return Object.assign({}, repoJSON, repoStat, {
        status: 'IDLE',
        notes
      })
    })
}

export default {
  getAllRepoStats,
  addRepo,
  getRepos
}
