import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './FolderItem.styl'
import store from 'browser/main/store'
import Repository from 'browser/lib/Repository'
import consts from 'browser/lib/consts'

const electron = require('electron')
const { remote } = electron
const { Menu, MenuItem } = remote

class FolderItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isEditing: false,
      isUpdating: false,
      name: props.folder.name
    }
  }

  handleColorButtonClick (color) {
    return (e) => {
      let { repository, folder } = this.props
      this.setState({
        isUpdating: true
      }, () => {
        Repository.find(repository.key)
          .then((repository) => {
            console.log(repository)
            return repository.updateFolder(folder.key, {color: color})
          })
          .then((folder) => {
            store.dispatch({
              type: 'EDIT_FOLDER',
              key: repository.key,
              folder: folder
            })
            this.setState({
              isEditing: false,
              isUpdating: false
            })
          })
          .catch((err) => {
            console.error(err)
            this.setState({
              isEditing: false,
              isUpdating: false
            })
          })
      })
    }
  }

  handleContextButtonClick (e) {
    e.stopPropagation()
    if (this.state.isUpdating) {
      return
    }

    var menu = new Menu()
    menu.append(new MenuItem({
      label: 'New Note'
    }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
      label: 'Rename',
      click: () => this.handleRenameButtonClick(e)
    }))
    var colorMenu = new Menu()
    consts.FOLDER_COLORS.forEach((color, index) => {
      colorMenu.append(new MenuItem({
        label: consts.FOLDER_COLOR_NAMES[index],
        click: (e) => this.handleColorButtonClick(color)(e)
      }))
    })
    menu.append(new MenuItem({
      label: 'Recolor',
      submenu: colorMenu
    }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
      label: 'Delete',
      click: () => this.handleDeleteButtonClick(e)
    }))

    menu.popup(remote.getCurrentWindow())
  }

  handleRenameButtonClick (e) {
    this.setState({
      isEditing: true,
      name: this.props.folder.name
    }, () => {
      this.refs.nameInput.focus()
      this.refs.nameInput.select()
    })
  }

  handleDeleteButtonClick (e) {
    let { repository, folder } = this.props

    this.setState({
      isUpdating: true
    }, () => {
      Repository.find(repository.key)
        .then((repository) => {
          console.log(repository)
          return repository.removeFolder(folder.key)
        })
        .then(() => {
          store.dispatch({
            type: 'REMOVE_FOLDER',
            repository: repository.key,
            folder: folder.key
          })
        })
        .catch((err) => {
          console.error(err)
          this.setState({
            isUpdating: false
          })
        })
    })
  }

  handleClick (e) {
    let { folder, repository } = this.props
    let { router } = this.context

    router.push('/repositories/' + repository.key + '/folders/' + folder.key)
  }

  renderIdle () {
    let { folder, repository, isFolded } = this.props
    let { router } = this.context

    let isActive = router.isActive('/repositories/' + repository.key + '/folders/' + folder.key)

    return (
      <div styleName={isFolded
          ? isActive ? 'root--folded--active' : 'root--folded'
          : isActive ? 'root--active' : 'root'
        }
        onClick={(e) => this.handleClick(e)}
        onContextMenu={(e) => this.handleContextButtonClick(e)}
      >
        <div styleName='label'>
          <i styleName='label-icon'
            className='fa fa-cube'
            style={{color: folder.color}}
          />
          <span styleName='label-name'>{folder.name}</span>
        </div>
        <div styleName='control'>
          <button styleName='control-button'
            onClick={(e) => this.handleContextButtonClick(e)}
          >
            <i className='fa fa-ellipsis-v'/>
          </button>
        </div>
      </div>
    )
  }

  handleNameInputChange (e) {
    this.setState({
      name: e.target.value
    })
  }

  handleNameInputBlur (e) {
    let { folder, repository } = this.props

    this.setState({
      isUpdating: true
    }, () => {
      Repository.find(repository.key)
        .then((repository) => {
          console.log(repository)
          return repository.updateFolder(folder.key, {name: this.state.name})
        })
        .then((folder) => {
          store.dispatch({
            type: 'EDIT_FOLDER',
            key: repository.key,
            folder: folder
          })
          this.setState({
            isEditing: false,
            isUpdating: false
          })
        })
        .catch((err) => {
          console.error(err)
          this.setState({
            isEditing: false,
            isUpdating: false
          })
        })
    })
  }

  renderEdit () {
    let { isFolded } = this.props
    return (
      <div styleName={isFolded
          ? 'root--edit--folded'
          : 'root--edit'
        }
      >
        <input styleName='nameInput'
          ref='nameInput'
          value={this.state.name}
          onChange={(e) => this.handleNameInputChange(e)}
          onBlur={(e) => this.handleNameInputBlur(e)}
          disabled={this.state.isUpdating}
        />
      </div>
    )
  }

  render () {
    return this.state.isEditing ? this.renderEdit() : this.renderIdle()
  }
}

FolderItem.contextTypes = {
  router: PropTypes.object
}

FolderItem.propTypes = {
  folder: PropTypes.shape({
    name: PropTypes.string,
    color: PropTypes.string
  }),
  repository: PropTypes.shape({
    key: PropTypes.string
  }),
  isFolded: PropTypes.bool
}

export default CSSModules(FolderItem, styles)
