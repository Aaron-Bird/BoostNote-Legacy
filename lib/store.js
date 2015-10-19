import reducer from './reducer'
import { createStore } from 'redux'
// import React from 'react'
// import { compose } from 'redux'
// import { devTools, persistState } from 'redux-devtools'
// import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react'

console.log(process.env)

var store, devToolEl
// if (process.env.NODE_ENV !== 'production') {
//   let finalCreateStore = compose(devTools(), persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)))(createStore)
//   let store = finalCreateStore(reducer)

//   devToolEl = (
//     <DebugPanel top right bottom>
//       <DevTools store={store} monitor={LogMonitor} visibleOnLoad={false}/>
//     </DebugPanel>
//   )
// } else {
// }
devToolEl = null
store = createStore(reducer)

export let devToolElement = devToolEl
export default store
