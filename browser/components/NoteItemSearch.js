import PropTypes from 'prop-types'
import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NoteItemSearch.styl'
import { searchLineFromNote } from 'browser/lib/search'

const NoteItemSearch = ({ note, searchword, handleNoteSearchClick }) => {
  const lines = searchLineFromNote(note, searchword)
  if (lines) {
    return (
      <div styleName='node-search-list'>
        {lines.map((line, index) => {
          return (
            <div
              key={index}
              styleName='node-search-item'
              onClick={e => handleNoteSearchClick(e, note.key, line.index)}
            >
              {line.content}
            </div>
          )
        })}
      </div>
    )
  } else {
    return null
  }
}

NoteItemSearch.propTypes = {
  note: PropTypes.shape({
    storage: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isrequired
  }),
  searchword: PropTypes.string,
  handleNoteSearchClick: PropTypes.func.isRequired
}

export default CSSModules(NoteItemSearch, styles)
