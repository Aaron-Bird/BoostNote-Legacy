/**
 * @fileoverview Micro component for showing storage.
 */
import PropTypes from 'prop-types'
import React from 'react'
import styles from './StorageItem.styl'
import CSSModules from 'browser/lib/CSSModules'
import _ from 'lodash'
import { SortableHandle } from 'react-sortable-hoc'

const DraggableIcon = SortableHandle(({ className }) => (
  <i className={`fa ${className}`} />
))

const FolderIcon = ({ className, color, isActive }) => {
  const iconStyle = isActive ? 'fa-folder-open-o' : 'fa-folder-o'
  return (
    <i className={`fa ${iconStyle} ${className}`} style={{ color: color }} />
  )
}

/**
 * @param {boolean} isActive
 * @param {object} tooltipRef,
 * @param {Function} handleButtonClick
 * @param {Function} handleMouseEnter
 * @param {Function} handleContextMenu
 * @param {string} folderName
 * @param {string} folderColor
 * @param {boolean} isFolded
 * @param {number} noteCount
 * @param {Function} handleDrop
 * @param {Function} handleDragEnter
 * @param {Function} handleDragOut
 * @return {React.Component}
 */
const StorageItem = ({
  styles,
  isActive,
  tooltipRef,
  handleButtonClick,
  handleMouseEnter,
  handleContextMenu,
  folderName,
  folderColor,
  isFolded,
  noteCount,
  handleDrop,
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  haveChildren,
  showChildren,
  handleClickShowChildrenBtn,
  isSearchMode
}) => {
  return (
    <button
      styleName={isActive ? 'folderList-item--active' : 'folderList-item'}
      onClick={handleButtonClick}
      onMouseEnter={handleMouseEnter}
      onContextMenu={handleContextMenu}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
    >
      {/* {!isFolded && (
        <DraggableIcon className={styles['folderList-item-reorder']} />
      )} */}
      <span
        styleName={
          isFolded ? 'folderList-item-name--folded' : 'folderList-item-name'
        }
      >
        {!isFolded && (
          <div
            onClick={handleClickShowChildrenBtn}
            className={styles['folderList-item-expended-wrapper']}
          >
            {haveChildren && (
              <span className={styles['folderList-item-expended-icon']}>
                <i
                  className={`fa ${
                    isSearchMode || showChildren
                      ? 'fa-angle-down'
                      : 'fa-angle-right'
                  }`}
                />
              </span>
            )}
          </div>
        )}

        <FolderIcon
          styleName='folderList-item-icon'
          color={folderColor}
          isActive={isActive}
        />

        {isFolded
          ? _.truncate(folderName, { length: 1, omission: '' })
          : folderName}
      </span>
      {!isFolded && _.isNumber(noteCount) && (
        <span styleName='folderList-item-noteCount'>{noteCount}</span>
      )}
      {isFolded && (
        <span styleName='folderList-item-tooltip' ref={tooltipRef}>
          {folderName}
        </span>
      )}
    </button>
  )
}

StorageItem.propTypes = {
  isActive: PropTypes.bool.isRequired,
  tooltipRef: PropTypes.object,
  handleButtonClick: PropTypes.func,
  handleMouseEnter: PropTypes.func,
  handleContextMenu: PropTypes.func,
  folderName: PropTypes.string.isRequired,
  folderColor: PropTypes.string,
  isFolded: PropTypes.bool.isRequired,
  handleDragEnter: PropTypes.func.isRequired,
  handleDragLeave: PropTypes.func.isRequired,
  handleDragOver: PropTypes.func.isRequired,
  noteCount: PropTypes.number,
  haveChildren: PropTypes.bool,
  showChildren: PropTypes.bool,
  handleClickShowChildrenBtn: PropTypes.func.isRequired,
  isSearchMode: PropTypes.bool
}

export default CSSModules(StorageItem, styles)
