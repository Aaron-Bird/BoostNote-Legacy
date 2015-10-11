var request = require('superagent-promise')(require('superagent'), Promise)
var apiUrl = require('../../../../config').apiUrl

export function createTeam (input) {
  return request
    .post(apiUrl + 'teams')
    .set({
      Authorization: 'Bearer ' + localStorage.getItem('token')
    })
    .send(input)
}
