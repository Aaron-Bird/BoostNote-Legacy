import { combineReducers, createStore } from 'redux'
import { routerReducer } from 'react-router-redux'

const OSX = global.process.platform === 'darwin'
const defaultConfig = {
  zoom: 1,
  isSideNavFolded: false,
  listWidth: 250,
  hotkey: {
    toggleFinder: OSX ? 'Cmd + Alt + S' : 'Super + Alt + S',
    toggleMain: OSX ? 'Cmd + Alt + L' : 'Super + Alt + E'
  },
  ui: {
    theme: 'default',
    disableDirectWrite: false
  },
  editor: {
    theme: 'xcode',
    fontSize: '14',
    fontFamily: 'Monaco, Consolas',
    indentType: 'space',
    indentSize: '4',
    switchPreview: 'BLUR' // Available value: RIGHTCLICK, BLUR
  },
  preview: {
    fontSize: '14',
    fontFamily: 'Lato',
    codeBlockTheme: 'xcode',
    lineNumber: true
  }
}

let defaultData = {
  storageMap: {},
  noteMap: {},
  starredSet: [],
  storageNoteMap: {},
  folderNoteMap: {},
  tagNoteMap: {}
}

function data (state = defaultData, action) {
  switch (action.type) {
    case 'THROTTLE_DATA':
      console.log(action)
      state = action.data
  }
  return state
}

function config (state = defaultConfig, action) {
  switch (action.type) {
    case 'INIT_CONFIG':
    case 'SET_CONFIG':
      return Object.assign({}, state, action.config)
    case 'SET_IS_SIDENAV_FOLDED':
      state.isSideNavFolded = action.isFolded
      return Object.assign({}, state)
    case 'SET_ZOOM':
      state.zoom = action.zoom
      return Object.assign({}, state)
    case 'SET_LIST_WIDTH':
      state.listWidth = action.listWidth
      return Object.assign({}, state)
    case 'SET_UI':
      return Object.assign({}, state, action.config)
  }
  return state
}

let reducer = combineReducers({
  data,
  config,
  routing: routerReducer
})

let store = createStore(reducer)

export default store
