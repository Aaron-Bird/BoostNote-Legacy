import React from 'react'
import reducer from './reducer'
import { createStore } from 'redux'
// Devtools
import { compose } from 'redux'
import { devTools, persistState } from 'redux-devtools'
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react'

let finalCreateStore = compose(devTools(), persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)))(createStore)
let store = finalCreateStore(reducer)

export let devToolElement = (
  <DebugPanel top right bottom>
    <DevTools store={store} monitor={LogMonitor} visibleOnLoad={false}/>
  </DebugPanel>
)

// let store = createStore(reducer)

export default store
