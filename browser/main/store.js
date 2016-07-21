import { combineReducers, createStore } from 'redux'
import { routerReducer } from 'react-router-redux'
import ConfigManager from 'browser/main/lib/ConfigManager'

function storages (state = [], action) {
  console.info('REDUX >> ', action)
  switch (action.type) {
    case 'INIT_ALL':
      return action.storages
    case 'ADD_STORAGE':
      {
        let storages = state.slice()

        storages.push(action.storage)

        return storages
      }
    case 'ADD_FOLDER':
    case 'REMOVE_FOLDER':
    case 'UPDATE_STORAGE':
      {
        let storages = state.slice()
        storages = storages
          .filter((storage) => storage.key !== action.storage.key)
        storages.push(action.storage)

        return storages
      }
    case 'REMOVE_STORAGE':
      {
        let storages = state.slice()
        storages = storages
          .filter((storage) => storage.key !== action.key)

        return storages
      }
  }
  return state
}

function notes (state = [], action) {
  switch (action.type) {
    case 'INIT_ALL':
      return action.notes
    case 'ADD_STORAGE':
      {
        let notes = state.slice()

        notes.concat(action.notes)

        return notes
      }
    case 'REMOVE_STORAGE':
      {
        let notes = state.slice()
        notes = notes
          .filter((note) => note.storage !== action.key)

        return notes
      }
    case 'REMOVE_FOLDER':
      {
        let notes = state.slice()
        notes = notes
          .filter((note) => note.storage !== action.storage.key || note.folder !== action.key)

        return notes
      }
    case 'CREATE_NOTE':
      {
        let notes = state.slice()
        notes.push(action.note)
        return notes
      }
    case 'UPDATE_NOTE':
      {
        let notes = state.slice()
        notes = notes.filter((note) => note.key !== action.note.key || note.folder !== action.note.folder || note.storage !== action.note.storage)
        notes.push(action.note)
        return notes
      }
    case 'MOVE_NOTE':
      {
        let notes = state.slice()
        notes = notes.filter((note) => note.key !== action.note.key || note.folder !== action.note.folder || note.storage !== action.note.storage)
        notes.push(action.newNote)
        return notes
      }
  }
  return state
}

const defaultConfig = ConfigManager.get()

function config (state = defaultConfig, action) {
  switch (action.type) {
    case 'SET_IS_SIDENAV_FOLDED':
      state.isSideNavFolded = action.isFolded
      return Object.assign({}, state)
    case 'SET_ZOOM':
      state.zoom = action.zoom
      return Object.assign({}, state)
    case 'SET_LIST_WIDTH':
      state.listWidth = action.listWidth
      return Object.assign({}, state)
    case 'SET_CONFIG':
      return Object.assign({}, state, action.config)
    case 'SET_UI':
      return Object.assign({}, state, action.config)
  }
  return state
}

let reducer = combineReducers({
  storages,
  notes,
  config,
  routing: routerReducer
})

let store = createStore(reducer)

export default store
