import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './Detail.styl'
import _ from 'lodash'
import NoteDetail from './NoteDetail'

const electron = require('electron')

const OSX = global.process.platform === 'darwin'

class Detail extends React.Component {
  componentDidUpdate (prevProps, prevState) {
  }

  render () {
    let { repositories, location } = this.props
    let note = null
    if (location.query.key != null) {
      let splitted = location.query.key.split('-')
      let repoKey = splitted.shift()
      let noteKey = splitted.shift()
      let repo = _.find(repositories, {key: repoKey})
      if (_.isObject(repo) && _.isArray(repo.notes)) {
        note = _.find(repo.notes, {key: noteKey})
      }
    }

    if (note == null) {
      return (
        <div className='Detail'
          style={this.props.style}
          styleName='root'
          tabIndex='0'
        >
          <div styleName='empty'>
            <div styleName='empty-message'>{OSX ? 'Command(⌘)' : 'Ctrl(^)'} + N<br/>to create a new post</div>
          </div>
        </div>
      )
    }

    return (
      <NoteDetail
        note={note}
        {..._.pick(this.props, [
          'dispatch',
          'repositories',
          'style',
          'ignorePreviewPointerEvents'
        ])}
      />
    )
  }
}

Detail.propTypes = {
  dispatch: PropTypes.func,
  repositories: PropTypes.array,
  style: PropTypes.shape({
    left: PropTypes.number
  }),
  ignorePreviewPointerEvents: PropTypes.bool
}

export default CSSModules(Detail, styles)
