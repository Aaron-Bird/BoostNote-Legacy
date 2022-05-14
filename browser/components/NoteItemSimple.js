/**
 * @fileoverview Note item component with simple display mode.
 */
import PropTypes, { node } from 'prop-types'
import React, { useEffect, useState } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NoteItemSimple.styl'
import i18n from 'browser/lib/i18n'
import NoteItemSearch from 'browser/components/NoteItemSearch'

/**
 * @description Note item component when using simple display mode.
 * @param {boolean} isActive
 * @param {Object} note
 * @param {Function} handleNoteClick
 * @param {Function} handleNoteContextMenu
 * @param {Function} handleDragStart
 */
const NoteItemSimple = ({
  isActive,
  isAllNotesView,
  note,
  handleNoteClick,
  handleNoteContextMenu,
  handleDragStart,
  pathname,
  storage,
  searchword,
  handleNoteSearchClick
}) => {
  const [showSearchResult, setShowSearchResult] = useState(false)
  useEffect(() => {
    setShowSearchResult(isActive)
  }, [isActive])
  return (
    <div
      styleName={isActive ? 'item-simple--active' : 'item-simple'}
      key={note.key}
      onClick={e => {
        if (isActive) {
          setShowSearchResult(!showSearchResult)
        }
        handleNoteClick(e, note.key)
      }}
      onContextMenu={e => handleNoteContextMenu(e, note.key)}
      onDragStart={e => handleDragStart(e, note)}
      draggable='true'
    >
      <div styleName='item-simple-title'>
        {note.type === 'SNIPPET_NOTE' ? (
          <i styleName='item-simple-title-icon' className='fa fa-fw fa-code' />
        ) : (
          <i
            styleName='item-simple-title-icon'
            className='fa fa-fw fa-file-text-o'
          />
        )}

        {searchword &&
          note.type === 'MARKDOWN_NOTE' &&
          (showSearchResult ? (
            <span
              styleName='item-search-folder-icon'
              onClick={() => setShowSearchResult(false)}
            >
              <i className='fa fa-angle-down' />
            </span>
          ) : (
            <span
              styleName='item-search-folder-icon'
              onClick={() => setShowSearchResult(true)}
            >
              <i className='fa fa-angle-right' />
            </span>
          ))}

        {note.isPinned && !pathname.match(/\/starred|\/trash/) ? (
          <span styleName='item-pin'>
            <i className='fa fa-thumb-tack' />
          </span>
        ) : (
          ''
        )}

        {note.title.trim().length > 0 ? (
          note.title
        ) : (
          <span styleName='item-simple-title-empty'>
            {i18n.__('Empty note')}
          </span>
        )}

        {isAllNotesView && (
          <div styleName='item-simple-right'>
            <span styleName='item-simple-right-storageName'>
              {storage.name}
            </span>
          </div>
        )}
      </div>
      {searchword && showSearchResult && (
        <NoteItemSearch
          note={note}
          searchword={searchword}
          handleNoteSearchClick={handleNoteSearchClick}
        />
      )}
    </div>
  )
}

NoteItemSimple.propTypes = {
  isActive: PropTypes.bool.isRequired,
  note: PropTypes.shape({
    storage: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isrequired
  }),
  handleNoteClick: PropTypes.func.isRequired,
  handleNoteContextMenu: PropTypes.func.isRequired,
  handleDragStart: PropTypes.func.isRequired,
  handleNoteSearchClick: PropTypes.func.isRequired
}

export default CSSModules(NoteItemSimple, styles)
