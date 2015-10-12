export const USER_UPDATE = 'USER_UPDATE'
export const SWITCH_USER = 'SWITCH_USER'
export const SWITCH_FOLDER = 'SWITCH_FOLDER'

export function updateUser (user) {
  return {
    type: USER_UPDATE,
    data: user
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
