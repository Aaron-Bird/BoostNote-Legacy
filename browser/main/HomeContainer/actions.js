export const PARAMS_CHANGE = 'PARAMS_CHANGE'
export const USER_UPDATE = 'USER_UPDATE'

export function updateUser (user) {
  return {
    type: USER_UPDATE,
    data: user
  }
}

export function switchParams (params) {
  return {
    type: PARAMS_CHANGE,
    data: params
  }
}
