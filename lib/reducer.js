import { combineReducers } from 'redux'
import _ from 'lodash'
import {
  // Status action type
  SWITCH_FOLDER,
  SWITCH_MODE,
  SWITCH_ARTICLE,
  SET_SEARCH_FILTER,
  SET_TAG_FILTER,
  CLEAR_SEARCH,
  LOCK_STATUS,
  UNLOCK_STATUS,
  TOGGLE_TUTORIAL,

  // user
  USER_UPDATE,

  // Article action type
  ARTICLE_UPDATE,
  ARTICLE_DESTROY,
  CLEAR_NEW_ARTICLE,

  // Folder action type
  FOLDER_CREATE,
  FOLDER_UPDATE,
  FOLDER_DESTROY,
  FOLDER_REPLACE,

  // view mode
  IDLE_MODE
} from './actions'
import dataStore from 'boost/dataStore'
import keygen from 'boost/keygen'
import activityRecord from 'boost/activityRecord'
import { openModal } from 'boost/modal'
import EditedAlert from 'boost/components/modal/EditedAlert'

const initialStatus = {
  mode: IDLE_MODE,
  search: '',
  isTutorialOpen: false,
  isStatusLocked: false
}

let data = dataStore.getData()
let initialArticles = data.articles
let initialFolders = data.folders
let initialUser = dataStore.getUser().user

let isStatusLocked = false
let isCreatingNew = false

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
        newFolder.name = newFolder.name.trim().replace(/\s/, '_')
        Object.assign(newFolder, {
          key: keygen(),
          createdAt: new Date(),
          updatedAt: new Date()
        })

        if (newFolder.name == null && newFolder.name.length === 0) throw new Error('Folder name is required')
        if (newFolder.name.match(/\//)) throw new Error('`/` is not available for folder name')

        let conflictFolder = _.findWhere(state, {name: newFolder.name})
        if (conflictFolder != null) throw new Error(`${newFolder.name} already exists!`)
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
        folder.name = folder.name.trim().replace(/\s/, '_')
        if (folder.name.length === 0) throw new Error('Folder name is required')
        if (folder.name.match(/\//)) throw new Error('`/` is not available for folder name')

        // Folder existence check
        if (targetFolder == null) throw new Error('Folder doesnt exist')
        // Name conflict check
        if (targetFolder.name !== folder.name) {
          let conflictFolder = _.find(state, _folder => {
            return folder.name === _folder.name && folder.key !== _folder.key
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
      return state
    default:
      return state
  }
}
let isCleaned = true
function articles (state = initialArticles, action) {
  state = state.slice()

  if (!isCreatingNew && !isCleaned) {
    state = state.filter(article => article.status !== 'NEW')
    isCleaned = true
  }
  switch (action.type) {
    case SWITCH_ARTICLE:
      if (action.data.isNew) {
        isCleaned = false
      }
      if (!isStatusLocked && !action.data.isNew) {
        isCreatingNew = false
        if (!isCleaned) {
          state = state.filter(article => article.status !== 'NEW')
          isCleaned = true
        }
      }
      return state
    case SWITCH_FOLDER:
    case SET_SEARCH_FILTER:
    case SET_TAG_FILTER:
    case CLEAR_SEARCH:
      if (!isStatusLocked) {
        isCreatingNew = false
        if (!isCleaned) {
          state = state.filter(article => article.status !== 'NEW')
          isCleaned = true
        }
      }
      return state
    case CLEAR_NEW_ARTICLE:
      return state.filter(article => article.status !== 'NEW')
    case ARTICLE_UPDATE:
      {
        let article = action.data.article

        let targetIndex = _.findIndex(state, _article => article.key === _article.key)
        if (targetIndex < 0) state.unshift(article)
        else state.splice(targetIndex, 1, article)

        if (article.status !== 'NEW') dataStore.setArticles(state)
          else isCreatingNew = true
        return state
      }
    case ARTICLE_DESTROY:
      {
        let articleKey = action.data.key

        let targetIndex = _.findIndex(state, _article => articleKey === _article.key)
        if (targetIndex >= 0) state.splice(targetIndex, 1)

        dataStore.setArticles(state)
        return state
      }
    case FOLDER_DESTROY:
      {
        let folderKey = action.data.key

        state = state.filter(article => article.FolderKey !== folderKey)

        dataStore.setArticles(state)
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
    case LOCK_STATUS:
      isStatusLocked = state.isStatusLocked = true
      return state
    case UNLOCK_STATUS:
      isStatusLocked = state.isStatusLocked = false
      return state
  }

  // if status locked, status become unmutable
  if (state.isStatusLocked) {
    openModal(EditedAlert, {action})
    return state
  }
  switch (action.type) {
    case SWITCH_FOLDER:
      state.mode = IDLE_MODE
      state.search = `//${action.data} `

      return state
    case SWITCH_MODE:
      state.mode = action.data

      return state
    case SWITCH_ARTICLE:
      state.articleKey = action.data.key
      state.mode = IDLE_MODE

      return state
    case SET_SEARCH_FILTER:
      state.search = action.data
      state.mode = IDLE_MODE

      return state
    case SET_TAG_FILTER:
      state.search = `#${action.data}`
      state.mode = IDLE_MODE

      return state
    case CLEAR_SEARCH:
      state.search = ''
      state.mode = IDLE_MODE

      return state
    default:
      return state
  }
}

export default combineReducers({
  user,
  folders,
  articles,
  status
})
