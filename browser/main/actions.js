// Action types
export const USER_UPDATE = 'USER_UPDATE'

export const CLEAR_NEW_ARTICLE = 'CLEAR_NEW_ARTICLE'
export const ARTICLE_UPDATE = 'ARTICLE_UPDATE'
export const ARTICLE_DESTROY = 'ARTICLE_DESTROY'
export const ARTICLE_SAVE = 'ARTICLE_SAVE'
export const ARTICLE_CACHE = 'ARTICLE_CACHE'
export const FOLDER_CREATE = 'FOLDER_CREATE'
export const FOLDER_UPDATE = 'FOLDER_UPDATE'
export const FOLDER_DESTROY = 'FOLDER_DESTROY'
export const FOLDER_REPLACE = 'FOLDER_REPLACE'

export const SWITCH_FOLDER = 'SWITCH_FOLDER'
export const SWITCH_ARTICLE = 'SWITCH_ARTICLE'
export const SET_SEARCH_FILTER = 'SET_SEARCH_FILTER'
export const SET_TAG_FILTER = 'SET_TAG_FILTER'
export const CLEAR_SEARCH = 'CLEAR_SEARCH'
export const TOGGLE_ONLY_UNSAVED_FILTER = 'TOGGLE_ONLY_UNSAVED_FILTER'

export const TOGGLE_TUTORIAL = 'TOGGLE_TUTORIAL'

// Article status
export const NEW = 'NEW'

export function updateUser (input) {
  return {
    type: USER_UPDATE,
    data: input
  }
}

// DB
export function clearNewArticle () {
  return {
    type: CLEAR_NEW_ARTICLE
  }
}

export function cacheArticle (key, article) {
  return {
    type: ARTICLE_CACHE,
    data: { key, article }
  }
}

export function saveArticle (key, article, forceSwitch) {
  return {
    type: ARTICLE_SAVE,
    data: { key, article, forceSwitch }
  }
}

export function updateArticle (article) {
  return {
    type: ARTICLE_UPDATE,
    data: { article }
  }
}

export function destroyArticle (key) {
  return {
    type: ARTICLE_DESTROY,
    data: { key }
  }
}

export function createFolder (folder) {
  return {
    type: FOLDER_CREATE,
    data: { folder }
  }
}

export function updateFolder (folder) {
  return {
    type: FOLDER_UPDATE,
    data: { folder }
  }
}

export function destroyFolder (key) {
  return {
    type: FOLDER_DESTROY,
    data: { key }
  }
}

export function replaceFolder (a, b) {
  return {
    type: FOLDER_REPLACE,
    data: {
      a,
      b
    }
  }
}

export function switchFolder (folderName) {
  return {
    type: SWITCH_FOLDER,
    data: folderName
  }
}

export function switchArticle (articleKey) {
  return {
    type: SWITCH_ARTICLE,
    data: {
      key: articleKey
    }
  }
}

export function setSearchFilter (search) {
  return {
    type: SET_SEARCH_FILTER,
    data: search
  }
}

export function setTagFilter (tag) {
  return {
    type: SET_TAG_FILTER,
    data: tag
  }
}

export function clearSearch () {
  return {
    type: CLEAR_SEARCH
  }
}

export function toggleOnlyUnsavedFilter () {
  return {
    type: TOGGLE_ONLY_UNSAVED_FILTER
  }
}

export function toggleTutorial () {
  return {
    type: TOGGLE_TUTORIAL
  }
}

export default {
  updateUser,
  clearNewArticle,
  updateArticle,
  destroyArticle,
  cacheArticle,
  saveArticle,
  createFolder,
  updateFolder,
  destroyFolder,
  replaceFolder,
  switchFolder,
  switchArticle,
  setSearchFilter,
  setTagFilter,
  clearSearch,
  toggleOnlyUnsavedFilter,
  toggleTutorial
}
