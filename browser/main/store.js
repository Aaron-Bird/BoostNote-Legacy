import { combineReducers, createStore } from 'redux'
import _ from 'lodash'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

/**
 * Repositories
 * ```
 * repositories = [{
 *   key: String,
 *   name: String,
 *   path: String, // path of repository
 *   status: String, // status of repository [IDLE, LOADING, READY, ERROR]
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
const initialRepositories = []

function repositories (state = initialRepositories, action) {
  console.log(action)
  switch (action.type) {
    case 'INIT_ALL':
      return action.data.slice()
    case 'ADD_REPOSITORY':
      {
        let repos = state.slice()

        repos.push(action.repository)

        return repos
      }
    case 'REMOVE_REPOSITORY':
      {
        let repos = state.slice()

        let targetIndex = _.findIndex(repos, {key: action.key})
        if (targetIndex > -1) {
          repos.splice(targetIndex, 1)
        }

        return repos
      }
    case 'ADD_FOLDER':
      {
        let repos = state.slice()
        let targetRepo = _.find(repos, {key: action.key})

        if (targetRepo == null) return state

        let targetFolderIndex = _.findIndex(targetRepo.folders, {key: action.folder.key})
        if (targetFolderIndex < 0) {
          targetRepo.folders.push(action.folder)
        } else {
          targetRepo.folders.splice(targetFolderIndex, 1, action.folder)
        }

        return repos
      }
    case 'EDIT_FOLDER':
      {
        let repos = state.slice()
        let targetRepo = _.find(repos, {key: action.key})

        if (targetRepo == null) return state

        let targetFolderIndex = _.findIndex(targetRepo.folders, {key: action.folder.key})
        if (targetFolderIndex < 0) {
          targetRepo.folders.push(action.folder)
        } else {
          targetRepo.folders.splice(targetFolderIndex, 1, action.folder)
        }

        return repos
      }
    /**
     *  Remove a folder from the repository
     * {
     *  type: 'REMOVE_FOLDER',
     *  repository: repositoryKey,
     *  folder: folderKey
     * }
     */
    case 'REMOVE_FOLDER':
      {
        let repos = state.slice()
        let targetRepo = _.find(repos, {key: action.repository})

        if (targetRepo == null) return state

        let targetFolderIndex = _.findIndex(targetRepo.folders, {key: action.folder})
        if (targetFolderIndex > -1) {
          targetRepo.folders.splice(targetFolderIndex, 1)
        }

        return repos
      }
  }
  return state
}

let reducer = combineReducers({
  repositories,
  routing: routerReducer
})

let store = createStore(reducer)

export default store
