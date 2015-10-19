import reducer from './reducer'
import { createStore } from 'redux'

// import React from 'react'
// import { compose } from 'redux'
// import { devTools, persistState } from 'redux-devtools'
// import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react'

// let finalCreateStore = compose(devTools(), persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)))(createStore)
// let store = finalCreateStore(reducer)

// devToolEl = (
//   <DebugPanel top right bottom>
//     <DevTools store={store} monitor={LogMonitor} visibleOnLoad={false}/>
//   </DebugPanel>
// )

// export let devToolElement = devToolEl
// export default store

let store = createStore(reducer)

export let devToolElement = null
export default store
