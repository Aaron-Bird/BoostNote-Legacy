import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './RepositorySection.styl'
import Repository from 'browser/lib/Repository'
import FolderItem from './FolderItem'

const electron = require('electron')
const { remote } = electron
const { Menu, MenuItem } = remote

class RepositorySection extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isOpen: true,
      isCreatingFolder: false,
      isSaving: false,
      newFolder: {
        name: ''
      }
    }
  }

  getRepository () {
    let { repository } = this.props
    return Repository.find(repository.key)
  }

  handleUnlinkButtonClick () {
    let { dispatch, repository } = this.props

    this.getRepository()
      .then((repositoryInstance) => {
        return repositoryInstance.unmount()
      })
      .then(() => {
        dispatch({
          type: 'REMOVE_REPOSITORY',
          key: repository.key
        })
      })
  }

  handleToggleButtonClick (e) {
    e.stopPropagation()
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  handleHeaderClick (e) {
    let { repository } = this.props
    let { router } = this.context
    router.push('/repositories/' + repository.key)
  }

  handleContextButtonClick (e) {
    e.stopPropagation()
    let menu = new Menu()
    menu.append(new MenuItem({
      label: 'New Folder',
      click: () => this.handleNewFolderButtonClick()
    }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
      label: 'Unmount',
      click: () => this.handleUnlinkButtonClick()
    }))

    menu.popup(remote.getCurrentWindow(), e.clientX, e.clientY - 44)
  }

  handleNewFolderButtonClick (e) {
    this.setState({
      isCreatingFolder: true,
      newFolder: {
        name: 'New Folder'
      }
    }, () => {
      this.refs.nameInput.select()
      this.refs.nameInput.focus()
    })
  }

  handleNewFolderFormChange (e) {
    let newFolder = this.state.newFolder
    newFolder.name = this.refs.nameInput.value

    this.setState({
      newFolder
    })
  }

  handleNameInputBlur (e) {
    let { dispatch, repository } = this.props

    this.setState({
      isSaving: true
    }, () => {
      this.getRepository()
        .then((repositoryInstance) => {
          return repositoryInstance.addFolder({
            name: this.state.newFolder.name
          })
        })
        .then((folder) => {
          dispatch({
            type: 'ADD_FOLDER',
            key: repository.key,
            folder: folder
          })

          this.setState({
            isCreatingFolder: false,
            isSaving: false
          })
        })
        .catch((err) => {
          console.error(err)

          this.setState({
            isCreatingFolder: false,
            isSaving: false
          })
        })
    })
  }

  render () {
    let { repository, isFolded } = this.props
    let { router } = this.context

    let isActive = router.isActive('/repositories/' + repository.key, true)

    let folderElements = repository.folders.map((folder) => {
      return (
        <FolderItem
          key={folder.key}
          folder={folder}
          repository={repository}
          isFolded={isFolded}
        />
      )
    })

    let toggleButtonIconClassName = this.state.isOpen
      ? 'fa fa-minus'
      : 'fa fa-plus'

    return (
      <div
        className='RepositorySection'
        styleName={isFolded ? 'root-folded' : 'root'}
      >
        <div styleName={isActive ? 'header--active' : 'header'}
          onClick={(e) => this.handleHeaderClick(e)}
          onContextMenu={(e) => this.handleContextButtonClick(e)}
        >
          <div styleName='header-name'>
            <i styleName='header-name-icon' className='fa fa-archive fa-fw'/>
            <span styleName='header-name-label'>{repository.name}</span>
          </div>

          <div styleName='header-control'>
            <button styleName='header-control-button'
              onClick={(e) => this.handleContextButtonClick(e)}
            >
              <i className='fa fa-ellipsis-v fa-fw'/>
            </button>
            <button styleName='header-control-button--show'
              onClick={(e) => this.handleToggleButtonClick(e)}
            >
              <i className={toggleButtonIconClassName}/>
            </button>
          </div>
        </div>
        {this.state.isOpen && <div>
          {folderElements}

          {this.state.isCreatingFolder
            ? <div styleName='newFolderForm'>
              <input styleName='newFolderForm-nameInput'
                ref='nameInput'
                disabled={this.state.isSaving}
                value={this.state.newFolder.name}
                onChange={(e) => this.handleNewFolderFormChange(e)}
                onBlur={(e) => this.handleNameInputBlur(e)}
              />
            </div>
            : <button styleName='newFolderButton'
              onClick={(e) => this.handleNewFolderButtonClick(e)}
            >
              <i styleName='newFolderButton-icon' className='fa fa-plus fa-fw'/>
              <span styleName='newFolderButton-label'>New Folder</span>
            </button>
          }
        </div>}
      </div>
    )
  }
}

RepositorySection.contextTypes = {
  router: PropTypes.object
}

RepositorySection.propTypes = {
  repository: PropTypes.shape({
    name: PropTypes.string,
    folders: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string
    }))
  }),
  dispatch: PropTypes.func,
  isFolded: PropTypes.bool
}

export default CSSModules(RepositorySection, styles)
