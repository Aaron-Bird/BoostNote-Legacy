import { combineReducers, createStore } from 'redux'
import { routerReducer } from 'react-router-redux'
import ConfigManager from 'browser/main/lib/ConfigManager'
import { Map, Set } from 'browser/lib/Mutable'
import _ from 'lodash'

function defaultDataMap () {
  return {
    storageMap: new Map(),
    noteMap: new Map(),
    starredSet: new Set(),
    storeageNoteMap: new Map(),
    folderNoteMap: new Map(),
    tagNoteMap: new Map()
  }
}

function data (state = defaultDataMap(), action) {
  switch (action.type) {
    case 'INIT_ALL':
      state = defaultDataMap()

      action.storages.forEach((storage) => {
        state.storageMap.set(storage.key, storage)
      })

      action.notes.forEach((note) => {
        let uniqueKey = note.storage + '-' + note.key
        let folderKey = note.storage + '-' + note.folder
        state.noteMap.set(uniqueKey, note)

        if (note.isStarred) {
          state.starredSet.add(uniqueKey)
        }

        let storageNoteList = state.storeageNoteMap.get(note.storage)
        if (storageNoteList == null) {
          storageNoteList = new Set(storageNoteList)
          state.storeageNoteMap.set(note.storage, storageNoteList)
        }
        storageNoteList.add(uniqueKey)

        let folderNoteList = state.folderNoteMap.get(folderKey)
        if (folderNoteList == null) {
          folderNoteList = new Set(folderNoteList)
          state.folderNoteMap.set(folderKey, folderNoteList)
        }
        folderNoteList.add(uniqueKey)

        note.tags.forEach((tag) => {
          let tagNoteList = state.tagNoteMap.get(tag)
          if (tagNoteList == null) {
            tagNoteList = new Set(tagNoteList)
            state.tagNoteMap.set(tag, tagNoteList)
          }
          tagNoteList.add(uniqueKey)
        })
      })
      return state
    case 'UPDATE_NOTE':
      {
        let note = action.note
        let uniqueKey = note.storage + '-' + note.key
        let folderKey = note.storage + '-' + note.folder
        let oldNote = state.noteMap.get(uniqueKey)

        state = Object.assign({}, state)
        state.noteMap = new Map(state.noteMap)
        state.noteMap.set(uniqueKey, note)

        if (oldNote == null || oldNote.isStarred !== note.isStarred) {
          state.starredSet = new Set(state.starredSet)
          if (note.isStarred) {
            state.starredSet.add(uniqueKey)
          } else {
            state.starredSet.delete(uniqueKey)
          }
        }

        // Update storageNoteMap if oldNote doesn't exist
        if (oldNote == null) {
          state.storeageNoteMap = new Map(state.storeageNoteMap)
          let noteSet = state.storeageNoteMap.get(note.storage)
          noteSet = new Set(noteSet)
          noteSet.add(uniqueKey)
          state.folderNoteMap.set(folderKey, noteSet)
        }

        // Update foldermap if folder changed or post created
        if (oldNote == null || oldNote.folder !== note.folder) {
          state.folderNoteMap = new Map(state.folderNoteMap)
          let folderNoteList = state.folderNoteMap.get(folderKey)
          folderNoteList = new Set(folderNoteList)
          folderNoteList.add(uniqueKey)
          state.folderNoteMap.set(folderKey, folderNoteList)

          if (oldNote != null) {
            let oldFolderKey = oldNote.storage + '-' + oldNote.folder
            let oldFolderNoteList = state.folderNoteMap.get(oldFolderKey)
            oldFolderNoteList = new Set(oldFolderNoteList)
            oldFolderNoteList.delete(uniqueKey)
            state.folderNoteMap.set(oldFolderKey, oldFolderNoteList)
          }
        }

        if (oldNote != null) {
          let discardedTags = _.difference(oldNote.tags, note.tags)
          let addedTags = _.difference(note.tags, oldNote.tags)
          if (discardedTags.length + addedTags.length > 0) {
            state.tagNoteMap = new Map(state.tagNoteMap)

            discardedTags.forEach((tag) => {
              let tagNoteList = state.tagNoteMap.get(tag)
              if (tagNoteList != null) {
                tagNoteList = new Set(tagNoteList)
                tagNoteList.delete(uniqueKey)
                state.tagNoteMap.set(tag, tagNoteList)
              }
            })
            addedTags.forEach((tag) => {
              let tagNoteList = state.tagNoteMap.get(tag)
              tagNoteList = new Set(tagNoteList)
              tagNoteList.add(uniqueKey)

              state.tagNoteMap.set(tag, tagNoteList)
            })
          }
        } else {
          state.tagNoteMap = new Map(state.tagNoteMap)
          note.tags.forEach((tag) => {
            let tagNoteList = state.tagNoteMap.get(tag)
            if (tagNoteList == null) {
              tagNoteList = new Set(tagNoteList)
              state.tagNoteMap.set(tag, tagNoteList)
            }
            tagNoteList.add(uniqueKey)
          })
        }

        return state
      }
    case 'MOVE_NOTE':
      {
        let originNote = action.originNote
        let originKey = originNote.storage + '-' + originNote.key
        let note = action.note
        let uniqueKey = note.storage + '-' + note.key
        let folderKey = note.storage + '-' + note.folder
        let oldNote = state.noteMap.get(uniqueKey)

        state = Object.assign({}, state)
        state.noteMap = new Map(state.noteMap)
        state.noteMap.delete(originKey)
        state.noteMap.set(uniqueKey, note)

        // If storage chanced, origin key must be discarded
        if (originKey !== uniqueKey) {
          console.log('diffrent storage')
          // From isStarred
          if (originNote.isStarred) {
            state.starredSet = new Set(state.starredSet)
            state.starredSet.delete(originKey)
          }

          // From storageNoteMap
          state.storeageNoteMap = new Map(state.storeageNoteMap)
          let noteSet = state.storeageNoteMap.get(originNote.storage)
          noteSet = new Set(noteSet)
          noteSet.delete(originKey)
          state.storeageNoteMap.set(originNote.storage, noteSet)

          // From folderNoteMap
          state.folderNoteMap = new Map(state.folderNoteMap)
          let originFolderKey = originNote.storage + '-' + originNote.folder
          let originFolderList = state.folderNoteMap.get(originFolderKey)
          originFolderList = new Set(originFolderList)
          originFolderList.delete(originKey)
          state.folderNoteMap.set(originFolderKey, originFolderList)

          // From tagMap
          if (originNote.tags.length > 0) {
            state.tagNoteMap = new Map(state.tagNoteMap)
            originNote.tags.forEach((tag) => {
              let noteSet = state.tagNoteMap.get(tag)
              noteSet = new Set(noteSet)
              noteSet.delete(originKey)
              state.tagNoteMap.set(tag, noteSet)
            })
          }
        }

        if (oldNote == null || oldNote.isStarred !== note.isStarred) {
          state.starredSet = new Set(state.starredSet)
          if (note.isStarred) {
            state.starredSet.add(uniqueKey)
          } else {
            state.starredSet.delete(uniqueKey)
          }
        }

        // Update storageNoteMap if oldNote doesn't exist
        if (oldNote == null) {
          state.storeageNoteMap = new Map(state.storeageNoteMap)
          let noteSet = state.storeageNoteMap.get(note.storage)
          noteSet = new Set(noteSet)
          noteSet.add(uniqueKey)
          state.folderNoteMap.set(folderKey, noteSet)
        }

        // Update foldermap if folder changed or post created
        if (oldNote == null || oldNote.folder !== note.folder) {
          state.folderNoteMap = new Map(state.folderNoteMap)
          let folderNoteList = state.folderNoteMap.get(folderKey)
          folderNoteList = new Set(folderNoteList)
          folderNoteList.add(uniqueKey)
          state.folderNoteMap.set(folderKey, folderNoteList)

          if (oldNote != null) {
            let oldFolderKey = oldNote.storage + '-' + oldNote.folder
            let oldFolderNoteList = state.folderNoteMap.get(oldFolderKey)
            oldFolderNoteList = new Set(oldFolderNoteList)
            oldFolderNoteList.delete(uniqueKey)
            state.folderNoteMap.set(oldFolderKey, oldFolderNoteList)
          }
        }

        // Remove from old folder map
        if (oldNote != null) {
          let discardedTags = _.difference(oldNote.tags, note.tags)
          let addedTags = _.difference(note.tags, oldNote.tags)
          if (discardedTags.length + addedTags.length > 0) {
            state.tagNoteMap = new Map(state.tagNoteMap)

            discardedTags.forEach((tag) => {
              let tagNoteList = state.tagNoteMap.get(tag)
              if (tagNoteList != null) {
                tagNoteList = new Set(tagNoteList)
                tagNoteList.delete(uniqueKey)
                state.tagNoteMap.set(tag, tagNoteList)
              }
            })
            addedTags.forEach((tag) => {
              let tagNoteList = state.tagNoteMap.get(tag)
              tagNoteList = new Set(tagNoteList)
              tagNoteList.add(uniqueKey)

              state.tagNoteMap.set(tag, tagNoteList)
            })
          }
        } else {
          state.tagNoteMap = new Map(state.tagNoteMap)
          note.tags.forEach((tag) => {
            let tagNoteList = state.tagNoteMap.get(tag)
            if (tagNoteList == null) {
              tagNoteList = new Set(tagNoteList)
              state.tagNoteMap.set(tag, tagNoteList)
            }
            tagNoteList.add(uniqueKey)
          })
        }

        return state
      }
    case 'DELETE_NOTE':
      {

        return state
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
  data,
  config,
  routing: routerReducer
})

let store = createStore(reducer)

export default store
