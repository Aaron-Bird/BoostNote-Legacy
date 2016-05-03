import { combineReducers, createStore } from 'redux'
import _ from 'lodash'

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
  }
  return state
}

let reducer = combineReducers({
  repositories
})

let store = createStore(reducer)

export default store
