import { combineReducers } from 'redux'
import _ from 'lodash'
import { SWITCH_FOLDER, SWITCH_MODE, SWITCH_ARTICLE, SET_SEARCH_FILTER, SET_TAG_FILTER, CLEAR_SEARCH, TOGGLE_TUTORIAL, ARTICLE_UPDATE, ARTICLE_DESTROY, FOLDER_CREATE, FOLDER_UPDATE, FOLDER_DESTROY, IDLE_MODE, CREATE_MODE } from './actions'
import dataStore from 'boost/dataStore'
import keygen from 'boost/keygen'
import activityRecord from 'boost/activityRecord'

const initialStatus = {
  mode: IDLE_MODE,
  search: '',
  isTutorialOpen: false
}

let data = dataStore.getData()
let initialArticles = data.articles
let initialFolders = data.folders

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
          updatedAt: new Date(),
          // random number (0-7)
          color: Math.round(Math.random() * 7)
        })

        if (newFolder.length === 0) throw new Error('Folder name is required')

        let conflictFolder = _.findWhere(state, {name: newFolder.name})
        if (conflictFolder != null) throw new Error(`${newFolder.name} already exists!`)
        state.push(newFolder)

        dataStore.setFolders(null, state)
        activityRecord.emit('FOLDER_CREATE')
        return state
      }
    case FOLDER_UPDATE:
      {
        let folder = action.data.folder
        let targetFolder = _.findWhere(state, {key: folder.key})

        if (!_.isString(folder.name)) throw new Error('Folder name must be a string')
        folder.name = folder.name.trim().replace(/\s/, '_')
        if (folder.length === 0) throw new Error('Folder name is required')

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

        dataStore.setFolders(null, state)
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
        dataStore.setFolders(null, state)
        activityRecord.emit('FOLDER_DESTROY')
        return state
      }
    default:
      return state
  }
}

function articles (state = initialArticles, action) {
  state = state.slice()
  switch (action.type) {
    case ARTICLE_UPDATE:
      {
        let article = action.data.article

        let targetIndex = _.findIndex(state, _article => article.key === _article.key)
        if (targetIndex < 0) state.unshift(article)
        else state.splice(targetIndex, 1, article)

        dataStore.setArticles(null, state)
        return state
      }
    case ARTICLE_DESTROY:
      {
        let articleKey = action.data.key

        let targetIndex = _.findIndex(state, _article => articleKey === _article.key)
        if (targetIndex >= 0) state.splice(targetIndex, 1)

        dataStore.setArticles(null, state)
        return state
      }
    case FOLDER_DESTROY:
      {
        let folderKey = action.data.key

        state = state.filter(article => article.FolderKey !== folderKey)

        dataStore.setArticles(null, state)
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
    case SWITCH_FOLDER:
      state.mode = IDLE_MODE
      state.search = `in:${action.data} `

      return state
    case SWITCH_MODE:
      state.mode = action.data
      if (state.mode === CREATE_MODE) state.articleKey = null

      return state
    case SWITCH_ARTICLE:
      state.articleKey = action.data
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
  folders,
  articles,
  status
})
