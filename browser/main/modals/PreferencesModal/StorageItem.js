import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './StorageItem.styl'
import consts from 'browser/lib/consts'
import dataApi from 'browser/main/lib/dataApi'
import store from 'browser/main/store'

const electron = require('electron')
const { shell, remote } = electron
const { Menu, MenuItem } = remote

class UnstyledFolderItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      status: 'IDLE',
      folder: {
        color: props.color,
        name: props.name
      }
    }
  }

  handleEditChange (e) {
    let { folder } = this.state

    folder.name = this.refs.nameInput.value
    this.setState({
      folder
    })
  }

  handleConfirmButtonClick (e) {
    let { storage, folder } = this.props
    dataApi
      .updateFolder(storage.key, folder.key, {
        color: this.state.folder.color,
        name: this.state.folder.name
      })
      .then((storage) => {
        store.dispatch({
          type: 'UPDATE_STORAGE',
          storage: storage
        })
        this.setState({
          status: 'IDLE'
        })
      })
  }

  handleColorButtonClick (e) {
    var menu = new Menu()

    consts.FOLDER_COLORS.forEach((color, index) => {
      menu.append(new MenuItem({
        label: consts.FOLDER_COLOR_NAMES[index],
        click: (e) => {
          let { folder } = this.state
          folder.color = color
          this.setState({
            folder
          })
        }
      }))
    })

    menu.popup(remote.getCurrentWindow())
  }

  handleCancelButtonClick (e) {
    this.setState({
      status: 'IDLE'
    })
  }

  renderEdit (e) {
    return (
      <div styleName='folderList-item'>
        <div styleName='folderList-item-left'>
          <button styleName='folderList-item-left-colorButton' style={{color: this.state.folder.color}}
            onClick={(e) => this.handleColorButtonClick(e)}
          >
            <i className='fa fa-square'/>
          </button>
          <input styleName='folderList-item-left-nameInput'
            value={this.state.folder.name}
            ref='nameInput'
            onChange={(e) => this.handleEditChange(e)}
          />
        </div>
        <div styleName='folderList-item-right'>
          <button styleName='folderList-item-right-confirmButton'
            onClick={(e) => this.handleConfirmButtonClick(e)}
          >
            Confirm
          </button>
          <button styleName='folderList-item-right-button'
            onClick={(e) => this.handleCancelButtonClick(e)}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  handleDeleteConfirmButtonClick (e) {
    let { storage, folder } = this.props
    dataApi
      .removeFolder(storage.key, folder.key)
      .then((storage) => {
        store.dispatch({
          type: 'REMOVE_FOLDER',
          key: folder.key,
          storage: storage
        })
      })
  }

  renderDelete () {
    return (
      <div styleName='folderList-item'>
        <div styleName='folderList-item-left'>
          Are you sure to <span styleName='folderList-item-left-danger'>delete</span> this folder?
        </div>
        <div styleName='folderList-item-right'>
          <button styleName='folderList-item-right-dangerButton'
            onClick={(e) => this.handleDeleteConfirmButtonClick(e)}
          >
            Confirm
          </button>
          <button styleName='folderList-item-right-button'
            onClick={(e) => this.handleCancelButtonClick(e)}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  handleEditButtonClick (e) {
    let { folder } = this.props
    this.setState({
      status: 'EDIT',
      folder: {
        color: folder.color,
        name: folder.name
      }
    }, () => {
      this.refs.nameInput.select()
    })
  }

  handleDeleteButtonClick (e) {
    this.setState({
      status: 'DELETE'
    })
  }

  renderIdle () {
    let { folder } = this.props
    return (
      <div styleName='folderList-item'
        onDoubleClick={(e) => this.handleEditButtonClick(e)}
      >
        <div styleName='folderList-item-left'
          style={{borderColor: folder.color}}
        >
          <span styleName='folderList-item-left-name'>{folder.name}</span>
          <span styleName='folderList-item-left-key'>({folder.key})</span>
        </div>
        <div styleName='folderList-item-right'>
          <button styleName='folderList-item-right-button'
            onClick={(e) => this.handleEditButtonClick(e)}
          >
            Edit
          </button>
          <button styleName='folderList-item-right-button'
            onClick={(e) => this.handleDeleteButtonClick(e)}
          >
            Delete
          </button>
        </div>
      </div>

    )
  }

  render () {
    switch (this.state.status) {
      case 'DELETE':
        return this.renderDelete()
      case 'EDIT':
        return this.renderEdit()
      case 'IDLE':
      default:
        return this.renderIdle()
    }
  }
}

const FolderItem = CSSModules(UnstyledFolderItem, styles)

class StorageItem extends React.Component {
  handleNewFolderButtonClick (e) {
    let { storage } = this.props
    let input = {
      name: 'Untitled',
      color: consts.FOLDER_COLORS[Math.floor(Math.random() * 7) % 7]
    }

    dataApi.createFolder(storage.key, input)
      .then((storage) => {
        store.dispatch({
          type: 'ADD_FOLDER',
          storage: storage
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  handleExternalButtonClick () {
    let { storage } = this.props
    shell.showItemInFolder(storage.path)
  }

  handleUnlinkButtonClick (e) {
    let { storage } = this.props
    dataApi.removeStorage(storage.key)
      .then(() => {
        store.dispatch({
          type: 'REMOVE_STORAGE',
          key: storage.key
        })
      })
      .catch((err) => {
        console.error(err)
      })
  }

  render () {
    let { storage } = this.props
    let folderList = storage.folders.map((folder) => {
      return <FolderItem key={folder.key}
        folder={folder}
        storage={storage}
      />
    })
    return (
      <div styleName='root' key={storage.key}>
        <div styleName='header'>
          <i className='fa fa-folder-open'/>&nbsp;
          {storage.name}&nbsp;
          <span styleName='header-path'>({storage.path})</span>
          <div styleName='header-control'>
            <button styleName='header-control-button'
              onClick={(e) => this.handleNewFolderButtonClick(e)}
            >
              <i className='fa fa-plus'/>
            </button>
            <button styleName='header-control-button'
              onClick={(e) => this.handleExternalButtonClick(e)}
            >
              <i className='fa fa-external-link'/>
            </button>
            <button styleName='header-control-button'
              onClick={(e) => this.handleUnlinkButtonClick(e)}
            >
              <i className='fa fa-unlink'/>
            </button>
          </div>
        </div>
        <div styleName='folderList'>
          {folderList.length > 0
            ? folderList
            : <div styleName='folderList-empty'>No Folders</div>
          }
        </div>
      </div>
    )
  }
}

StorageItem.propTypes = {
  storage: PropTypes.shape({
    key: PropTypes.string
  }),
  folder: PropTypes.shape({
    key: PropTypes.string,
    color: PropTypes.string,
    name: PropTypes.string
  })
}

export default CSSModules(StorageItem, styles)
