const keygen = require('browser/lib/keygen')
const fs = require('fs')
const path = require('path')
const CSON = require('season')
const _ = require('lodash')
const consts = require('browser/lib/consts')

let repositories = []

/**
 * # Repository
 *
 * ## Life cycle
 *
 * ```js
 * // Add reposiotry
 * var repo = new Repository({name: 'test', path: '/Users/somebody/test'})
 * repo
 *   .mount()
 *   .then(() => repo.load())
 *
 * // Update Cached
 * repo.saveCache({name: 'renamed'})
 *
 * // Update JSON
 * repo.saveJSON({author: 'Other user'})
 *
 * // Remove repository
 * repo.unmount()
 * ```
 *
 * ## `this.cached`
 *
 * Information of a Repository. It stores in `repoStats` key of localStorage
 *
 * ```js
 * this.cached = {
 *   "key":"523280a789404d430ce571ab9148fdd1343336cb",
 *   "name":"test",
 *   "path":"/Users/dickchoi/test"
 * }
 * ```
 *
 * ## `this.json`
 *
 * Parsed object from `boostrepo.json`. See `boostrepo.json`.
 *
 * ## Repository file structure
 *
 * The root directory of a Repository. It has several files and folders.
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
 * #### `boostrepo.json`
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
 * #### `data` directory
 *
 * Every note will be saved here as a single CSON file to `git diff` efficiently.
 * > This is because CSON supports Multiline string.
 * File name of each cson file will be used to identify note.
 * Commonly, Boostnote will automatically generate sha1 key and use it as a file name when creating a new note.
 *
 * ##### `note.cson`
 *
 * ```cson
 * tags: [String] // tags
 * folder: String // hash key of folder
 * mode: String // syntax mode
 * title: String
 * content: String
 * createdAt: Date
 * updatedAt: Date
 * ```
 *
 * ### Full data
 *
 * Full data of a Repository. It includes not only information also all data(notes). Redux will directly handle this data.
 *
 * ```js
 * var repo = Object.assign({}, repoJSON, notesData, cached, {status: 'READY'})
 *
 * // repo
 * {
 *   {...repoJSON}
 *   "key": "523280a789404d430ce571ab9148fdd1343336cb",
 *   "name": "test",
 *   "path": "/Users/dickchoi/test",
 *   "notes": [], // See `note.cson`
 *   "status": "READY" // If Boostnote failed to fetch data, It will be set `ERROR`
 * }
 * ```
 */

class Repository {
  constructor (cached) {
    this.cached = _.pick(cached, ['key', 'name', 'path'])
    this.status = 'IDLE'
    this.isMount = false
  }

  /**
   * Reload and set all data of a repository
   * @return {Promise} full data of a repository
   */
  load () {
    if (!_.isString(this.cached.key)) {
      console.warn('The key of this repository doesn\'t seem to be valid. You should input this data to Redux reducer after setting the key properly.')
    }
    let name = this.cached.name
    let targetPath = this.cached.path

    targetPath = path.join(targetPath)
    let dataPath = path.join(targetPath, 'data')

    let initializeRepository = () => {
      let resolveDataDirectory = this.constructor.resolveDirectory(path.join(targetPath, 'data'))
      let resolveBoostrepoJSON = this.constructor.resolveJSON(path.join(targetPath, 'boostrepo.json'), {name: name})
      return Promise.all([resolveDataDirectory, resolveBoostrepoJSON])
        .then((data) => {
          this.json = data[1]
          return true
        })
    }

    let fetchNotes = () => {
      let noteNames = fs.readdirSync(dataPath)
      let notes = noteNames
        .map((noteName) => path.join(dataPath, noteName))
        .filter((notePath) => CSON.isObjectPath(notePath))
        .map((notePath) => {
          return new Promise(function (resolve, reject) {
            CSON.readFile(notePath, function (err, obj) {
              if (err != null) {
                console.log(err)
                return resolve(null)
              }
              obj.key = path.basename(notePath, '.cson')
              return resolve(obj)
            })
          })
        })
        .filter((note) => note != null)

      return Promise.all(notes)
        .then((notes) => {
          this.notes = notes
          return true
        })
    }

    return this.constructor.resolveDirectory(targetPath)
      .then(initializeRepository)
      .then(fetchNotes)
      .then(() => {
        this.status = 'READY'

        return this.getData()
      })
      .catch((err) => {
        this.status = 'ERROR'
        this.error = err
        console.error(err)
        return this
      })
  }

  /**
   * Add repository to localStorage
   * If key doesn't exist, it will generate it.
   * If a cache having same key extists in localStorage, override it.
   *
   * @return {Promise} added cache data
   */
  mount () {
    let allCached = this.constructor.getAllCached()

    // If key is not set, generate new one.
    if (!_.isString(this.cached.key)) {
      this.cached.key = keygen()
      // Repeat utill generated key becomes unique.
      while (_.findIndex(allCached, {key: this.cached.key}) > -1) {
        this.cached.key = keygen()
      }
    }

    let targetCachedIndex = _.findIndex(allCached, {key: this.cached.key})
    if (targetCachedIndex > -1) {
      allCached.splice(targetCachedIndex, 1, this.cached)
    } else {
      allCached.push(this.cached)
    }
    this.constructor.saveAllCached(allCached)
    this.isMount = true

    // Put in `repositories` array if it isn't in.
    let targetIndex = _.findIndex(repositories, (repo) => {
      this.cached.key === repo.cached.key
    })
    if (targetIndex < 0) {
      repositories.push(this)
    }

    return Promise.resolve(this.cached)
  }

  /**
   * Remove repository from localStorage
   * @return {Promise} remoded cache data
   */
  unmount () {
    let allCached = this.constructor.getAllCached()

    let targetCachedIndex = _.findIndex(allCached, {key: this.cached.key})
    if (targetCachedIndex > -1) {
      allCached.splice(targetCachedIndex, 1)
    }
    this.constructor.saveAllCached(allCached)
    this.isMount = false

    // Discard from `repositories` array if it is in.
    let targetIndex = _.findIndex(repositories, (repo) => {
      this.cached.key === repo.cached.key
    })
    if (targetIndex > -1) {
      repositories.splice(targetIndex, 1)
    }

    return Promise.resolve(this.cached)
  }

  /**
   * Get all data of a repository
   *
   * If data is not ready, try to load it.
   *
   * @return {Promise} all data of a repository
   */
  getData () {
    function carbonCopy (obj) {
      return JSON.parse(JSON.stringify(obj))
    }
    if (this.status === 'IDLE') {
      return this.load()
    }

    if (this.status === 'ERROR') {
      return Promise.resolve(carbonCopy(Object.assign({}, this.json, this.cached, {
        status: this.status
      })))
    }

    return Promise.resolve(carbonCopy(Object.assign({}, this.json, this.cached, {
      status: this.status,
      notes: this.notes
    })))
  }

  /**
   * Save Cached
   * @param  {Object} newCached
   * @return {Promies} updated Cached
   */
  saveCached (newCached) {
    if (_.isObject(newCached)) {
      Object.assign(this.cached, _.pick(newCached, ['name', 'path']))
    }

    if (this.isMount) {
      this.mount()
    }

    return Promise.resolve(this.cached)
  }

  /**
   * Save JSON
   * @param  {Object}  newJSON
   * @return {Promise} updated JSON
   */
  saveJSON (newJSON) {
    let jsonPath = path.join(this.cached.path, 'boostrepo.json')
    if (_.isObject(newJSON)) {
      Object.assign(this.json, newJSON)
    }

    return new Promise((resolve, reject) => {
      CSON
        .writeFile(jsonPath, this.json, (err) => {
          if (err != null) return reject(err)
          resolve(this.json)
        })
    })
  }

  /**
   * Save both Cached and JSON
   * @return {Promise} resolve array have cached and JSON
   */
  save () {
    return Promise.all([this.saveCached(), this.saveJSON()])
  }

  /**
   * Add a folder
   * @param {Object} newFolder
   * @return {Promise} new folder
   */
  addFolder (newFolder) {
    let { folders } = this.json

    newFolder = _.pick(newFolder, ['color', 'name'])
    if (!_.isString(newFolder.name) || newFolder.name.trim().length === 0) newFolder.name = 'unnamed'
    else newFolder.name = newFolder.name.trim()

    if (!_.isString(newFolder.color)) newFolder.color = this.constructor.randomColor()

    newFolder.key = keygen()
    while (_.findIndex(folders, {key: newFolder.key}) > -1) {
      newFolder.key = keygen()
    }

    folders.push(newFolder)

    return this.saveJSON(this.json)
      .then(() => newFolder)
  }

  /**
   * Update a folder
   * @param  {String} folderKey [description]
   * @param  {Object} override   [description]
   * @return {[type]}           [description]
   */
  updateFolder (folderKey, override) {
    let { folders } = this.json

    let targetFolder = _.find(folders, {key: folderKey})
    if (targetFolder == null) {
      return this.addFolder(override)
    }
    if (_.isString(override.name) && override.name.trim().length > 0) targetFolder.name = override.name.trim()
    if (_.isString(override.color)) targetFolder.color = override.color

    return this.saveJSON(this.json)
      .then(() => targetFolder)
  }

  /**
   * Remove a folder
   * @param  {String} folderKey
   * @return {Promise} removed folder
   */
  removeFolder (folderKey) {
    let { folders } = this.json
    let targetFolder = null

    let targetIndex = _.findIndex(folders, {key: folderKey})
    if (targetIndex > -1) {
      targetFolder = folders.splice(targetIndex, 1)[0]
    }

    return this.saveJSON(null)
      .then(() => targetFolder)
  }

  addNote (newNote) {
    newNote = Object.assign({}, _.pick(newNote, ['content', 'tags', 'folder', 'mode', 'title']))

    if (!this.constructor.validateNote(newNote)) {
      return Promise.reject(new Error('Invalid input'))
    }

    newNote.key = keygen()
    while (_.find(this.notes, {key: newNote.key}) != null) {
      newNote.key = keygen()
    }
    newNote.createdAt = new Date()
    newNote.updatedAt = new Date()
    this.notes.push(newNote)

    return new Promise((resolve, reject) => {
      CSON.writeFile(path.join(this.cached.path, 'data', newNote.key + '.cson'), _.omit(newNote, ['key']), function (err) {
        if (err != null) return reject(err)
        resolve(newNote)
      })
    })
  }

  static validateNote (note) {
    if (!_.isString(note.title)) return false
    if (!_.isString(note.content)) return false
    if (!_.isArray(note.tags)) return false
    if (!note.tags.every((tag) => _.isString(tag))) return false
    if (!_.isString(note.folder)) return false
    if (!_.isString(note.mode)) return false
    return true
  }

  getNote (noteKey) {
    let note = _.find(this.notes, {key: noteKey})

    return Promise.resolve(note)
  }

  updateNote (noteKey, override) {
    if (!this.constructor.validateNote(override)) {
      return Promise.reject(new Error('Invalid input'))
    }

    override.updatedAt = new Date()
    return new Promise((resolve, reject) => {
      CSON.writeFile(path.join(this.cached.path, 'data', noteKey + '.cson'), _.omit(override, ['key']), function (err) {
        if (err != null) return reject(err)
        override.key = noteKey
        resolve(override)
      })
    })
  }

  removeNote (noteKey) {
    let noteIndex = _.findIndex(this.notes, {key: noteKey})

    if (noteIndex < 0) return Promise.resolve(null)

    let note = this.notes[noteIndex]
    this.notes.splice(noteIndex, 1)

    return new Promise((resolve, reject) => {
      fs.unlink(path.join(this.cached.path, 'data', noteKey + '.cson'), function (err) {
        if (err != null) return reject(err)
        resolve(note)
      })
    })
  }

  getAllNotes () {
    return Promise.resolve(this.notes)
  }

  /**
   * Static Methods
   */

  static generateDefaultJSON (override) {
    return Object.assign({
      name: 'unnamed',
      remotes: [],
      folders: [{
        key: keygen(),
        name: 'general',
        color: this.randomColor()
      }]
    }, override)
  }

  /**
   * # Resolve Repository JSON
   *
   * Fetch and parse JSON from given path.
   * If boostrepo.json doesn't exist, create new one.
   *
   * @param  {String} targetPath [description]
   * @param  {Object} defaultOverrides Overrided to default value of RepoJSON when creating new one.
   * @return {Promise} resolving parsed data
   */
  static resolveJSON (targetPath, defaultOverrides) {
    return (new Promise((resolve, reject) => {
      let writeNew = () => {
        let newRepoJSON = this.generateDefaultJSON(defaultOverrides)
        CSON.writeFile(targetPath, newRepoJSON, (err) => {
          if (err != null) return reject(err)
          resolve(newRepoJSON)
        })
      }
      // If JSON doesn't exist, make a new one.
      if (CSON.resolve(targetPath) == null) {
        writeNew()
      } else {
        CSON.readFile(targetPath, (err, obj) => {
          if (err != null) return reject(err)
          if (obj == null) {
            writeNew()
          } else {
            resolve(obj)
          }
        })
      }
    }))
  }

  /**
   * # Resolve directory.
   *
   * Make sure the directory exists.
   * If directory doesn't exist, it will try to make a new one.
   * If failed, it return rejected promise
   *
   * @param  {String} targetPath Target path of directory
   * @return {Promise} resolving targetPath
   */
  static resolveDirectory (targetPath) {
    return new Promise(function (resolve, reject) {
      // check the directory exists
      fs.stat(targetPath, function (err, stat) {
        // Reject errors except `ENOENT`
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
  static getAllCached () {
    let data
    try {
      data = JSON.parse(localStorage.getItem('repositories'))
      if (!_.isArray(data)) {
        throw new Error('Data is corrupted. it must be an array.')
      }
    } catch (err) {
      data = []
      this.saveAllCached(data)
    }
    return data
  }

  static saveAllCached (allCached) {
    console.info('cach updated > ', allCached)
    localStorage.setItem('repositories', JSON.stringify(allCached))
  }

  static loadAll () {
    repositories = []
    return Promise.all(this.getAllCached().map((cached) => {
      let repo = new this(cached)
      repositories.push(repo)

      return repo.load()
    }))
  }

  static list () {
    return Promise.resolve(repositories)
  }

  static find (repoKey) {
    let repository = _.find(repositories, {cached: {key: repoKey}})
    return Promise.resolve(repository)
  }

  static randomColor () {
    return consts.FOLDER_COLORS[Math.floor(Math.random() * consts.FOLDER_COLORS.length)]
  }
}

export default Repository
