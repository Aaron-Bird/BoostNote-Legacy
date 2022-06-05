import PropTypes, { node } from 'prop-types'
import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './StorageItem.styl'
import modal from 'browser/main/lib/modal'
import CreateFolderModal from 'browser/main/modals/CreateFolderModal'
import RenameFolderModal from 'browser/main/modals/RenameFolderModal'
import dataApi from 'browser/main/lib/dataApi'
import StorageItemChild from 'browser/components/StorageItem'
import _ from 'lodash'
import i18n from 'browser/lib/i18n'
import context from 'browser/lib/context'
import { push } from 'connected-react-router'
import {
  SortableTree,
  TreeNodeLine
} from 'browser/lib/react-sortable-tree-list'
import {
  toSortableTreeData,
  toStorageFoldersData
} from 'browser/lib/sortableTreeDataTransform'

const { remote } = require('electron')
const { dialog } = remote
const escapeStringRegexp = require('escape-string-regexp')
const path = require('path')

class StorageItem extends React.Component {
  constructor(props) {
    super(props)

    const { storage } = this.props

    this.state = {
      isOpen: !!storage.isOpen,
      draggedOver: null
    }
  }

  handleHeaderContextMenu(e) {
    context.popup([
      {
        label: i18n.__('Add Folder'),
        click: e => this.handleAddFolderButtonClick(e)
      },
      {
        type: 'separator'
      },
      {
        label: i18n.__('Export Storage'),
        submenu: [
          {
            label: i18n.__('Export as Plain Text (.txt)'),
            click: e => this.handleExportStorageClick(e, 'txt')
          },
          {
            label: i18n.__('Export as Markdown (.md)'),
            click: e => this.handleExportStorageClick(e, 'md')
          },
          {
            label: i18n.__('Export as HTML (.html)'),
            click: e => this.handleExportStorageClick(e, 'html')
          },
          {
            label: i18n.__('Export as PDF (.pdf)'),
            click: e => this.handleExportStorageClick(e, 'pdf')
          }
        ]
      },
      {
        type: 'separator'
      },
      {
        label: i18n.__('Unlink Storage'),
        click: e => this.handleUnlinkStorageClick(e)
      }
    ])
  }

  handleUnlinkStorageClick(e) {
    const index = dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'warning',
      message: i18n.__('Unlink Storage'),
      detail: i18n.__(
        "This work will just detatches a storage from Boostnote. (Any data won't be deleted.)"
      ),
      buttons: [i18n.__('Confirm'), i18n.__('Cancel')]
    })

    if (index === 0) {
      const { storage, dispatch } = this.props
      dataApi
        .removeStorage(storage.key)
        .then(() => {
          dispatch({
            type: 'REMOVE_STORAGE',
            storageKey: storage.key
          })
        })
        .catch(err => {
          throw err
        })
    }
  }

  handleExportStorageClick(e, fileType) {
    const options = {
      properties: ['openDirectory', 'createDirectory'],
      buttonLabel: i18n.__('Select directory'),
      title: i18n.__('Select a folder to export the files to'),
      multiSelections: false
    }
    dialog.showOpenDialog(remote.getCurrentWindow(), options, paths => {
      if (paths && paths.length === 1) {
        const { storage, dispatch, config } = this.props
        dataApi
          .exportStorage(storage.key, fileType, paths[0], config)
          .then(data => {
            dialog.showMessageBox(remote.getCurrentWindow(), {
              type: 'info',
              message: `Exported to ${paths[0]}`
            })

            dispatch({
              type: 'EXPORT_STORAGE',
              storage: data.storage,
              fileType: data.fileType
            })
          })
          .catch(error => {
            dialog.showErrorBox(
              'Export error',
              error ? error.message || error : 'Unexpected error during export'
            )
            throw error
          })
      }
    })
  }

  handleToggleButtonClick(e) {
    const { storage, dispatch } = this.props
    const isOpen = !this.state.isOpen
    dataApi.toggleStorage(storage.key, isOpen).then(storage => {
      dispatch({
        type: 'EXPAND_STORAGE',
        storage,
        isOpen
      })
    })
    this.setState({
      isOpen: isOpen
    })
  }

  handleAddFolderButtonClick(e) {
    const { storage } = this.props

    modal.open(CreateFolderModal, {
      storage
    })
  }

  handleHeaderInfoClick(e) {
    const { storage, dispatch } = this.props
    dispatch(push('/storages/' + storage.key))
  }

  handleFolderButtonClick(folderKey) {
    return e => {
      const { storage, dispatch } = this.props
      dispatch(push('/storages/' + storage.key + '/folders/' + folderKey))
    }
  }

  handleFolderMouseEnter(e, tooltipRef, isFolded) {
    if (isFolded) {
      const buttonEl = e.currentTarget
      const tooltipEl = tooltipRef.current

      tooltipEl.style.top = buttonEl.getBoundingClientRect().y + 'px'
    }
  }

  handleFolderButtonContextMenu(e, folder) {
    context.popup([
      {
        label: i18n.__('添加下级菜单'),
        click: e => this.handleAddChildFolderClick(e, folder)
      },
      {
        label: i18n.__('Rename Folder'),
        click: e => this.handleRenameFolderClick(e, folder)
      },
      {
        type: 'separator'
      },
      {
        label: i18n.__('Export Folder'),
        submenu: [
          {
            label: i18n.__('Export as Plain Text (.txt)'),
            click: e => this.handleExportFolderClick(e, folder, 'txt')
          },
          {
            label: i18n.__('Export as Markdown (.md)'),
            click: e => this.handleExportFolderClick(e, folder, 'md')
          },
          {
            label: i18n.__('Export as HTML (.html)'),
            click: e => this.handleExportFolderClick(e, folder, 'html')
          },
          {
            label: i18n.__('Export as PDF (.pdf)'),
            click: e => this.handleExportFolderClick(e, folder, 'pdf')
          }
        ]
      },
      {
        type: 'separator'
      },
      {
        label: i18n.__('Delete Folder'),
        click: e => this.handleFolderDeleteClick(e, folder)
      }
    ])
  }

  handleRenameFolderClick(e, folder) {
    const { storage } = this.props
    modal.open(RenameFolderModal, {
      storage,
      folder
    })
  }

  handleAddChildFolderClick(e, folder) {
    const { storage } = this.props
    modal.open(CreateFolderModal, {
      storage,
      parent: folder
    })
  }

  handleExportFolderClick(e, folder, fileType) {
    const options = {
      properties: ['openDirectory', 'createDirectory'],
      buttonLabel: i18n.__('Select directory'),
      title: i18n.__('Select a folder to export the files to'),
      multiSelections: false
    }
    dialog.showOpenDialog(remote.getCurrentWindow(), options, paths => {
      if (paths && paths.length === 1) {
        const { storage, dispatch, config } = this.props
        dataApi
          .exportFolder(storage.key, folder.key, fileType, paths[0], config)
          .then(data => {
            dialog.showMessageBox(remote.getCurrentWindow(), {
              type: 'info',
              message: `Exported to ${paths[0]}`
            })

            dispatch({
              type: 'EXPORT_FOLDER',
              storage: data.storage,
              folderKey: data.folderKey,
              fileType: data.fileType
            })
          })
          .catch(error => {
            dialog.showErrorBox(
              'Export error',
              error ? error.message || error : 'Unexpected error during export'
            )
            throw error
          })
      }
    })
  }

  handleFolderDeleteClick(e, folder) {
    const index = dialog.showMessageBox(remote.getCurrentWindow(), {
      type: 'warning',
      message: i18n.__('Delete Folder'),
      detail: i18n.__(
        'This will delete all notes in the folder and can not be undone.'
      ),
      buttons: [i18n.__('Confirm'), i18n.__('Cancel')]
    })

    if (index === 0) {
      const { storage, dispatch } = this.props
      dataApi.deleteFolder(storage.key, folder.key).then(data => {
        dispatch({
          type: 'DELETE_FOLDER',
          storage: data.storage,
          folderKey: data.folderKey,
          deleteFolderKeys: data.deleteFolderKeys
        })
      })
    }
  }

  handleDragEnter(e, key) {
    e.preventDefault()
    if (this.state.draggedOver === key) {
      return
    }
    this.setState({
      draggedOver: key
    })
  }

  handleDragLeave(e) {
    e.preventDefault()
    if (this.state.draggedOver === null) {
      return
    }
    this.setState({
      draggedOver: null
    })
  }

  handleDragOver(e, key) {
    // Fix folder.key is null when drag note to folder element
    this.handleDragEnter(e, key)
  }

  dropNote(storage, folder, dispatch, location, noteData) {
    noteData = noteData.filter(note => folder.key !== note.folder)
    if (noteData.length === 0) return

    Promise.all(
      noteData.map(note =>
        dataApi.moveNote(note.storage, note.key, storage.key, folder.key)
      )
    )
      .then(createdNoteData => {
        createdNoteData.forEach(newNote => {
          dispatch({
            type: 'MOVE_NOTE',
            originNote: noteData.find(
              note => note.content === newNote.oldContent
            ),
            note: newNote
          })
        })
      })
      .catch(err => {
        console.error(`error on delete notes: ${err}`)
      })
  }

  handleDrop(e, storage, folder, dispatch, location) {
    e.preventDefault()
    // Avoid bubble to sortable tree parent element
    e.stopPropagation()
    if (this.state.draggedOver !== null) {
      this.setState({
        draggedOver: null
      })
    }
    // Avoid error when dragging a folder from storage to another
    const noteDataStr = e.dataTransfer.getData('note')
    if (noteDataStr) {
      const noteData = JSON.parse(noteDataStr)
      this.dropNote(storage, folder, dispatch, location, noteData)
    }
  }

  render() {
    const {
      storage,
      location,
      isFolded,
      data,
      dispatch,
      isSearchMode
    } = this.props
    const { folderNoteMap, trashedSet } = data

    const isActive = location.pathname.match(
      new RegExp(
        escapeStringRegexp(path.sep) +
          'storages' +
          escapeStringRegexp(path.sep) +
          storage.key +
          '$'
      )
    )

    return (
      <div styleName={isFolded ? 'root--folded' : 'root'} key={storage.key}>
        <div
          styleName={isActive ? 'header--active' : 'header'}
          onContextMenu={e => this.handleHeaderContextMenu(e)}
        >
          <button
            styleName='header-toggleButton'
            onMouseDown={e => this.handleToggleButtonClick(e)}
          >
            <img
              src={
                this.state.isOpen
                  ? '../resources/icon/icon-down.svg'
                  : '../resources/icon/icon-right.svg'
              }
            />
          </button>

          {!isFolded && (
            <button
              styleName='header-addFolderButton'
              onClick={e => this.handleAddFolderButtonClick(e)}
            >
              <img src='../resources/icon/icon-plus.svg' />
            </button>
          )}

          <button
            styleName='header-info'
            onClick={e => this.handleHeaderInfoClick(e)}
          >
            <span>
              {isFolded
                ? _.truncate(storage.name, { length: 1, omission: '' })
                : storage.name}
            </span>
            {isFolded && (
              <span styleName='header-info--folded-tooltip'>
                {storage.name}
              </span>
            )}
          </button>
        </div>
        {this.state.isOpen && (
          <SortableTree
            sortable={!isSearchMode}
            expandAll={isSearchMode}
            nodeList={toSortableTreeData(storage.folders)}
            onChange={nodeList => {
              if (isSearchMode) return
              dataApi
                .updateFolders(storage.key, toStorageFoldersData(nodeList))
                .then(data => {
                  dispatch({ type: 'REORDER_FOLDER', storage: data.storage })
                })
            }}
          >
            {TreeNodeLine(
              props => {
                const { node: folder, updateComponent, nodeList } = props
                const folderRegex = new RegExp(
                  escapeStringRegexp(path.sep) +
                    'storages' +
                    escapeStringRegexp(path.sep) +
                    storage.key +
                    escapeStringRegexp(path.sep) +
                    'folders' +
                    escapeStringRegexp(path.sep) +
                    folder.key
                )
                const isActive = !!location.pathname.match(folderRegex)
                const tooltipRef = React.createRef(null)
                const noteSet = folderNoteMap.get(
                  storage.key + '-' + folder.key
                )

                let noteCount = 0
                if (noteSet) {
                  let trashedNoteCount = 0
                  const noteKeys = noteSet.map(noteKey => {
                    return noteKey
                  })
                  trashedSet.toJS().forEach(trashedKey => {
                    if (
                      noteKeys.some(noteKey => {
                        return noteKey === trashedKey
                      })
                    )
                      trashedNoteCount++
                  })
                  noteCount = noteSet.size - trashedNoteCount
                }

                return (
                  <StorageItemChild
                    key={folder.key}
                    isSearchMode={isSearchMode}
                    isActive={isActive || folder.key === this.state.draggedOver}
                    tooltipRef={tooltipRef}
                    handleButtonClick={e =>
                      this.handleFolderButtonClick(folder.key)(e)
                    }
                    handleMouseEnter={e =>
                      this.handleFolderMouseEnter(e, tooltipRef, isFolded)
                    }
                    handleContextMenu={e =>
                      this.handleFolderButtonContextMenu(e, folder)
                    }
                    folderName={folder.name}
                    folderColor={folder.color}
                    isFolded={isFolded}
                    noteCount={noteCount}
                    handleDrop={e => {
                      this.handleDrop(e, storage, folder, dispatch, location)
                    }}
                    handleDragEnter={e => {
                      this.handleDragEnter(e, folder.key)
                    }}
                    handleDragLeave={e => {
                      this.handleDragLeave(e, folder)
                    }}
                    handleDragOver={e => {
                      this.handleDragOver(e, folder.key)
                    }}
                    haveChildren={
                      Array.isArray(folder.children) &&
                      folder.children.length > 0
                    }
                    showChildren={folder.expanded || false}
                    handleClickShowChildrenBtn={e => {
                      if (isSearchMode) return

                      e.stopPropagation()
                      folder.expanded = !folder.expanded
                      if (!folder.expanded && folder.children) {
                        const children = [...folder.children]
                        while (children.length) {
                          const childFolder = children.shift()
                          childFolder.expanded = false
                          if (childFolder.children) {
                            children.push(...childFolder.children)
                          }
                        }
                      }

                      updateComponent()
                      dataApi
                        .updateFolders(
                          storage.key,
                          toStorageFoldersData(nodeList)
                        )
                        .then(data => {
                          dispatch({
                            type: 'UPDATE_FOLDER',
                            storage: data.storage
                          })
                        })
                    }}
                  />
                )
              },
              { indent: isFolded ? 0 : 20 }
            )}
          </SortableTree>
        )}
      </div>
    )
  }
}

StorageItem.propTypes = {
  isFolded: PropTypes.bool,
  isSearchMode: PropTypes.bool
}

export default CSSModules(StorageItem, styles)
