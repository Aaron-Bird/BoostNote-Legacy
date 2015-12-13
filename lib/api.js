import superagent from 'superagent'
import superagentPromise from 'superagent-promise'
// import auth from 'boost/auth'

export const SERVER_URL = 'https://b00st.io/'
// export const SERVER_URL = 'http://localhost:3333/'

export const request = superagentPromise(superagent, Promise)

export function shareWithPublicURL (input) {
  return request
    .post(SERVER_URL + 'apis/share')
    // .set({
    //   Authorization: 'Bearer ' + auth.token()
    // })
    .send(input)
}

export default {
  SERVER_URL,
  shareWithPublicURL
}
