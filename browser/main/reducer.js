import { combineReducers } from 'redux'
import _ from 'lodash'
import {
  // Status action type
  SWITCH_FOLDER,
  SWITCH_ARTICLE,
  SET_SEARCH_FILTER,
  SET_TAG_FILTER,
  CLEAR_SEARCH,
  TOGGLE_TUTORIAL,

  // user
  USER_UPDATE,

  // Article action type
  ARTICLE_UPDATE,
  ARTICLE_DESTROY,
  ARTICLE_CACHE,
  ARTICLE_UNCACHE,
  ARTICLE_UNCACHE_ALL,
  ARTICLE_SAVE,
  ARTICLE_SAVE_ALL,

  // Folder action type
  FOLDER_CREATE,
  FOLDER_UPDATE,
  FOLDER_DESTROY,
  FOLDER_REPLACE
} from './actions'
import dataStore from 'browser/lib/dataStore'
import keygen from 'browser/lib/keygen'
import activityRecord from 'browser/lib/activityRecord'

const initialStatus = {
  search: '',
  isTutorialOpen: false
}

let data = {
  articles: [],
  folders: []
}
let initialArticles = {
  data: data && data.articles ? data.articles : [],
  modified: []
}
let initialFolders = data && data.folders ? data.folders : []
let initialUser = {}

function user (state = initialUser, action) {
  switch (action.type) {
    case USER_UPDATE:
      let updated = Object.assign(state, action.data)
      dataStore.saveUser(null, updated)
      return updated
    default:
      return state
  }
}

function folders (state = initialFolders, action) {
  state = state.slice()
  switch (action.type) {
    case FOLDER_CREATE:
      {
        let newFolder = action.data.folder
        if (!_.isString(newFolder.name)) throw new Error('Folder name must be a string')
        newFolder.name = newFolder.name.trim().replace(/\s/g, '_')

        Object.assign(newFolder, {
          key: keygen(),
          createdAt: new Date(),
          updatedAt: new Date()
        })

        if (newFolder.name == null || newFolder.name.length === 0) throw new Error('Folder name is required')
        if (newFolder.name.match(/\//)) throw new Error('`/` is not available for folder name')

        let conflictFolder = _.find(state, folder => folder.name.toLowerCase() === newFolder.name.toLowerCase())
        if (conflictFolder != null) throw new Error(`${conflictFolder.name} already exists!`)
        state.push(newFolder)

        dataStore.setFolders(state)
        activityRecord.emit('FOLDER_CREATE')
        return state
      }
    case FOLDER_UPDATE:
      {
        let folder = action.data.folder
        let targetFolder = _.findWhere(state, {key: folder.key})

        if (!_.isString(folder.name)) throw new Error('Folder name must be a string')
        folder.name = folder.name.trim().replace(/\s/g, '_')
        if (folder.name.length === 0) throw new Error('Folder name is required')
        if (folder.name.match(/\//)) throw new Error('`/` is not available for folder name')

        // Folder existence check
        if (targetFolder == null) throw new Error('Folder doesnt exist')
        // Name conflict check
        if (targetFolder.name !== folder.name) {
          let conflictFolder = _.find(state, _folder => {
            return folder.name.toLowerCase() === _folder.name.toLowerCase() && folder.key !== _folder.key
          })
          if (conflictFolder != null) throw new Error('Name conflicted')
        }
        Object.assign(targetFolder, folder, {
          updatedAt: new Date()
        })

        dataStore.setFolders(state)
        activityRecord.emit('FOLDER_UPDATE')
        return state
      }
    case FOLDER_DESTROY:
      {
        if (state.length < 2) throw new Error('Folder must exist more than one')

        let targetKey = action.data.key
        let targetIndex = _.findIndex(state, folder => folder.key === targetKey)
        if (targetIndex >= 0) {
          state.splice(targetIndex, 1)
        }
        dataStore.setFolders(state)
        activityRecord.emit('FOLDER_DESTROY')
        return state
      }
    case FOLDER_REPLACE:
      {
        let { a, b } = action.data
        let folderA = state[a]
        let folderB = state[b]
        state.splice(a, 1, folderB)
        state.splice(b, 1, folderA)
      }
      dataStore.setFolders(state)
      return state
    default:
      return state
  }
}

function compareArticle (original, modified) {
  var keys = _.keys(_.pick(modified, ['mode', 'title', 'tags', 'content', 'FolderKey']))

  return keys.reduce((sum, key) => {
    if ((key === 'tags' && !_.isEqual(original[key], modified[key])) || (key !== 'tags' && original[key] !== modified[key])) {
      if (sum == null) {
        sum = {
          key: original.key
        }
      }
      sum[key] = modified[key]
    }
    return sum
  }, null)
}

function articles (state = initialArticles, action) {
  switch (action.type) {
    case ARTICLE_CACHE:
      {
        let modified = action.data.article
        let targetKey = action.data.key
        let originalIndex = _.findIndex(state.data, _article => targetKey === _article.key)
        if (originalIndex === -1) return state
        let modifiedIndex = _.findIndex(state.modified, _article => targetKey === _article.key)

        modified = compareArticle(state.data[originalIndex], modified)
        if (modified == null) {
          if (modifiedIndex !== -1) state.modified.splice(modifiedIndex, 1)
          return state
        }

        if (modifiedIndex === -1) state.modified.push(modified)
        else Object.assign(state.modified[modifiedIndex], modified)
        return state
      }
    case ARTICLE_UNCACHE:
      {
        let targetKey = action.data.key
        let modifiedIndex = _.findIndex(state.modified, _article => targetKey === _article.key)
        if (modifiedIndex >= 0) state.modified.splice(modifiedIndex, 1)
        return state
      }
    case ARTICLE_UNCACHE_ALL:
      state.modified = []
      return state
    case ARTICLE_SAVE:
      {
        let targetKey = action.data.key
        let override = action.data.article
        let modifiedIndex = _.findIndex(state.modified, _article => targetKey === _article.key)
        let modified = modifiedIndex !== -1 ? state.modified.splice(modifiedIndex, 1)[0] : null

        let targetIndex = _.findIndex(state.data, _article => targetKey === _article.key)
        // Make a new if target article is not found.
        if (targetIndex === -1) {
          state.data.push(Object.assign({
            title: '',
            content: '',
            mode: 'markdown',
            tags: [],
            craetedAt: new Date()
          }, modified, override, {key: targetKey, updatedAt: new Date()}))
          return state
        }

        Object.assign(state.data[targetIndex], modified, override, {key: targetKey, updatedAt: new Date()})

        dataStore.setArticles(state.data)
        return state
      }
    case ARTICLE_SAVE_ALL:
      if (state.modified.length > 0) {
        state.modified.forEach(modifiedArticle => {
          let targetIndex = _.findIndex(state.data, _article => modifiedArticle.key === _article.key)
          Object.assign(state.data[targetIndex], modifiedArticle, {key: modifiedArticle.key, updatedAt: new Date()})
        })
      }

      state.modified = []
      dataStore.setArticles(state.data)

      return state
    case ARTICLE_UPDATE:
      {
        let article = action.data.article

        let targetIndex = _.findIndex(state.data, _article => article.key === _article.key)
        if (targetIndex < 0) state.data.unshift(article)
        else Object.assign(state.data[targetIndex], article)

        dataStore.setArticles(state.data)
        return state
      }
    case ARTICLE_DESTROY:
      {
        let articleKey = action.data.key

        let targetIndex = _.findIndex(state.data, _article => articleKey === _article.key)
        if (targetIndex >= 0) state.data.splice(targetIndex, 1)
        let modifiedIndex = _.findIndex(state.modified, _article => articleKey === _article.key)
        if (modifiedIndex >= 0) state.modified.splice(modifiedIndex, 1)

        dataStore.setArticles(state.data)
        return state
      }
    case FOLDER_DESTROY:
      {
        let folderKey = action.data.key

        state.data = state.data.filter(article => article.FolderKey !== folderKey)

        dataStore.setArticles(state.data)
        return state
      }
    default:
      return state
  }
}

function status (state = initialStatus, action) {
  state = Object.assign({}, state)
  switch (action.type) {
    case TOGGLE_TUTORIAL:
      state.isTutorialOpen = !state.isTutorialOpen
      return state
  }

  switch (action.type) {
    case ARTICLE_SAVE:
      if (action.data.forceSwitch) {
        let article = action.data.article
        state.articleKey = article.key
        state.search = ''
      }
      return state
    case SWITCH_FOLDER:
      state.search = `\/\/${action.data} `

      return state
    case SWITCH_ARTICLE:
      state.articleKey = action.data.key

      return state
    case SET_SEARCH_FILTER:
      state.search = action.data

      return state
    case SET_TAG_FILTER:
      state.search = `#${action.data}`

      return state
    case CLEAR_SEARCH:
      state.search = ''

      return state
    default:
      return state
  }
}

/**
 * v0.6.* Reducers
 */

/**
 * Repositories
 * ```
 * repositories = [{
 *   key: String,
 *   name: String,
 *   path: String, // path of repository
 *   status: String, // status of repository [LOADING, IDLE, ERROR]
 *   folders: {
 *     name: String,
 *     color: String
 *   },
 *   notes: [{
 *     key: String,
 *     title: String,
 *     content: String,
 *     folder: String,
 *     tags: [String],
 *     createdAt: Date,
 *     updatedAt: Date
 *   }]
 * }]
 * ```
 */
import RepositoryManager from 'browser/lib/RepositoryManager'
const initialRepositories = RepositoryManager.getRepos()

function repositories (state = initialRepositories, action) {
  console.log(state)
  switch (action.type) {
    case 'ADD_REPOSITORY':
      let repos = state.slice()
      repos.push(action.data)
      return repos
  }
  return state
}
// v0.6 end

export default combineReducers({
  user,
  folders,
  articles,
  status,
  repositories
})
