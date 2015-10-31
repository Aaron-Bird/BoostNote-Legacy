// Action types
export const ARTICLE_UPDATE = 'ARTICLE_UPDATE'
export const ARTICLE_DESTROY = 'ARTICLE_DESTROY'
export const FOLDER_CREATE = 'FOLDER_CREATE'
export const FOLDER_UPDATE = 'FOLDER_UPDATE'
export const FOLDER_DESTROY = 'FOLDER_DESTROY'

export const SWITCH_FOLDER = 'SWITCH_FOLDER'
export const SWITCH_MODE = 'SWITCH_MODE'
export const SWITCH_ARTICLE = 'SWITCH_ARTICLE'
export const SET_SEARCH_FILTER = 'SET_SEARCH_FILTER'
export const SET_TAG_FILTER = 'SET_TAG_FILTER'

// Status - mode
export const IDLE_MODE = 'IDLE_MODE'
export const CREATE_MODE = 'CREATE_MODE'
export const EDIT_MODE = 'EDIT_MODE'

// Article status
export const NEW = 'NEW'
export const SYNCING = 'SYNCING'
export const UNSYNCED = 'UNSYNCED'

// DB
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

export function switchFolder (folderName) {
  return {
    type: SWITCH_FOLDER,
    data: folderName
  }
}

export function switchMode (mode) {
  return {
    type: SWITCH_MODE,
    data: mode
  }
}

export function switchArticle (articleKey) {
  return {
    type: SWITCH_ARTICLE,
    data: articleKey
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
