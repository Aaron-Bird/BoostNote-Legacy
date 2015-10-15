// Action types
export const USER_UPDATE = 'USER_UPDATE'
export const ARTICLE_REFRESH = 'ARTICLE_REFRESH'
export const ARTICLE_UPDATE = 'ARTICLE_UPDATE'
export const ARTICLE_DESTROY = 'ARTICLE_DESTROY'

export const SWITCH_USER = 'SWITCH_USER'
export const SWITCH_FOLDER = 'SWITCH_FOLDER'
export const SWITCH_MODE = 'SWITCH_MODE'
export const SWITCH_ARTICLE = 'SWITCH_ARTICLE'

// Status - mode
export const IDLE_MODE = 'IDLE_MODE'
export const CREATE_MODE = 'CREATE_MODE'
export const EDIT_MODE = 'EDIT_MODE'

// Article status
export const NEW = 'NEW'
export const SYNCING = 'SYNCING'
export const UNSYNCED = 'UNSYNCED'

// DB
export function updateUser (user) {
  return {
    type: USER_UPDATE,
    data: user
  }
}

export function refreshArticles (userId, articles) {
  return {
    type: ARTICLE_REFRESH,
    data: {userId, articles}
  }
}

export function updateArticle (userId, article) {
  return {
    type: ARTICLE_UPDATE,
    data: {userId, article}
  }
}

export function destroyArticle (userId, articleId) {
  return {
    type: ARTICLE_DESTROY,
    data: { userId, articleId }
  }
}

// Nav
export function switchUser (userId) {
  return {
    type: SWITCH_USER,
    data: userId
  }
}

export function switchFolder (folderId) {
  return {
    type: SWITCH_FOLDER,
    data: folderId
  }
}

export function switchMode (mode) {
  return {
    type: SWITCH_MODE,
    data: mode
  }
}

export function switchArticle (articleId) {
  return {
    type: SWITCH_ARTICLE,
    data: articleId
  }
}
