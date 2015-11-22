// Action types
export const CLEAR_NEW_ARTICLE = 'CLEAR_NEW_ARTICLE'
export const ARTICLE_UPDATE = 'ARTICLE_UPDATE'
export const ARTICLE_DESTROY = 'ARTICLE_DESTROY'
export const FOLDER_CREATE = 'FOLDER_CREATE'
export const FOLDER_UPDATE = 'FOLDER_UPDATE'
export const FOLDER_DESTROY = 'FOLDER_DESTROY'
export const FOLDER_REPLACE = 'FOLDER_REPLACE'

export const SWITCH_FOLDER = 'SWITCH_FOLDER'
export const SWITCH_MODE = 'SWITCH_MODE'
export const SWITCH_ARTICLE = 'SWITCH_ARTICLE'
export const SET_SEARCH_FILTER = 'SET_SEARCH_FILTER'
export const SET_TAG_FILTER = 'SET_TAG_FILTER'
export const CLEAR_SEARCH = 'CLEAR_SEARCH'
export const LOCK_STATUS = 'LOCK_STATUS'
export const UNLOCK_STATUS = 'UNLOCK_STATUS'
export const TOGGLE_TUTORIAL = 'TOGGLE_TUTORIAL'

// Status - mode
export const IDLE_MODE = 'IDLE_MODE'
export const EDIT_MODE = 'EDIT_MODE'

// Article status
export const NEW = 'NEW'

// DB
export function clearNewArticle () {
  return {
    type: CLEAR_NEW_ARTICLE
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

export function switchMode (mode) {
  return {
    type: SWITCH_MODE,
    data: mode
  }
}

export function switchArticle (articleKey, isNew) {
  return {
    type: SWITCH_ARTICLE,
    data: {
      key: articleKey,
      isNew: isNew
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

export function lockStatus () {
  return {
    type: LOCK_STATUS
  }
}

export function unlockStatus () {
  return {
    type: UNLOCK_STATUS
  }
}

export function toggleTutorial () {
  return {
    type: TOGGLE_TUTORIAL
  }
}
