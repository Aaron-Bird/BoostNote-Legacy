import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './Detail.styl'
import _ from 'lodash'
import MarkdownNoteDetail from './MarkdownNoteDetail'
import SnippetNoteDetail from './SnippetNoteDetail'

const electron = require('electron')

const OSX = global.process.platform === 'darwin'

class Detail extends React.Component {
  componentDidUpdate (prevProps, prevState) {
  }

  render () {
    let { location, notes, config } = this.props
    let note = null
    if (location.query.key != null) {
      let splitted = location.query.key.split('-')
      let storageKey = splitted.shift()
      let folderKey = splitted.shift()
      let noteKey = splitted.shift()

      note = _.find(notes, {
        storage: storageKey,
        folder: folderKey,
        key: noteKey
      })
    }

    if (note == null) {
      return (
        <div styleName='root'
          style={this.props.style}
          tabIndex='0'
        >
          <div styleName='empty'>
            <div styleName='empty-message'>{OSX ? 'Command(⌘)' : 'Ctrl(^)'} + N<br/>to create a new post</div>
          </div>
        </div>
      )
    }

    if (note.type === 'SNIPPET_NOTE') {
      return (
        <SnippetNoteDetail
          note={note}
          config={config}
          {..._.pick(this.props, [
            'dispatch',
            'storages',
            'style',
            'ignorePreviewPointerEvents'
          ])}
        />
      )
    }

    return (
      <MarkdownNoteDetail
        note={note}
        config={config}
        {..._.pick(this.props, [
          'dispatch',
          'storages',
          'style',
          'ignorePreviewPointerEvents'
        ])}
      />
    )
  }
}

Detail.propTypes = {
  dispatch: PropTypes.func,
  storages: PropTypes.array,
  style: PropTypes.shape({
    left: PropTypes.number
  }),
  ignorePreviewPointerEvents: PropTypes.bool
}

export default CSSModules(Detail, styles)
