export const USER_UPDATE = 'USER_UPDATE'
export const ARTICLE_UPDATE = 'ARTICLE_UPDATE'
export const SWITCH_USER = 'SWITCH_USER'
export const SWITCH_FOLDER = 'SWITCH_FOLDER'
export const SWITCH_MODE = 'SWITCH_MODE'

export const IDLE_MODE = 'IDLE_MODE'
export const CREATE_MODE = 'CREATE_MODE'
export const EDIT_MODE = 'EDIT_MODE'

export const NEW = 'NEW'
export const SYNCING = 'SYNCING'
export const UNSYNCED = 'UNSYNCED'

export function updateUser (user) {
  return {
    type: USER_UPDATE,
    data: user
  }
}

export function updateArticles (userId, articles) {
  return {
    type: ARTICLE_UPDATE,
    data: {userId, articles}
  }
}

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
