import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NoteDetail.styl'
const electron = require('electron')

const OSX = global.process.platform === 'darwin'

class NoteDetail extends React.Component {
  componentDidUpdate (prevProps, prevState) {
  }

  renderEmpty () {
    return (
      <div styleName='empty'>
        <div styleName='empty-message'>{OSX ? 'Command(⌘)' : 'Ctrl(^)'} + N<br/>to create a new post</div>
      </div>
    )
  }

  render () {
    let isEmpty = true
    let view = isEmpty
      ? this.renderEmpty()
      : null
    return (
      <div className='NoteDetail'
        style={this.props.style}
        styleName='root'
        tabIndex='0'
      >
        {view}
      </div>
    )
  }
}

NoteDetail.propTypes = {
  dispatch: PropTypes.func,
  repositories: PropTypes.array,
  style: PropTypes.shape({
    left: PropTypes.number
  })
}

export default CSSModules(NoteDetail, styles)
