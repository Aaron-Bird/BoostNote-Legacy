import reducer from './reducer'
import { createStore } from 'redux'

let store = createStore(reducer)

export let devToolElement = null
export default store
