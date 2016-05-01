import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './SideNav.styl'
import actions from 'browser/main/actions'
import { openModal, isModalOpen } from 'browser/lib/modal'
import Preferences from '../../modal/Preferences'
import CreateNewFolder from '../../modal/CreateNewFolder'
import Repository from './Repository'
import NewRepositoryModal from '../../modal/NewRepositoryModal'

const ipc = require('electron').ipcRenderer

class SideNav extends React.Component {
  constructor (props) {
    super(props)
    this.newFolderHandler = (e) => {
      if (isModalOpen()) return true
      this.handleNewFolderButton(e)
    }
  }

  componentDidMount () {
    ipc.on('nav-new-folder', this.newFolderHandler)
  }

  componentWillUnmount () {
    ipc.removeListener('nav-new-folder', this.newFolderHandler)
  }

  handlePreferencesButtonClick (e) {
    openModal(Preferences)
  }

  handleNewFolderButton (e) {
    let { user } = this.props
    openModal(CreateNewFolder, {user: user})
  }

  handleFolderButtonClick (name) {
    return (e) => {
      let { dispatch } = this.props
      dispatch(actions.switchFolder(name))
    }
  }

  handleAllFoldersButtonClick (e) {
    let { dispatch } = this.props
    dispatch(actions.setSearchFilter(''))
  }

  handleNewRepositoryButtonClick (e) {
    openModal(NewRepositoryModal)
  }

  render () {
    let { repositories, dispatch } = this.props
    let repositorieElements = repositories.map((repo) => {
      return <Repository
        key={repo.name}
        repository={repo}
        dispatch={dispatch}
      />
    })

    return (
      <div
        className='SideNav'
        styleName='root'
        tabIndex='1'
      >
        <div styleName='menu'>
          <button styleName='menu-button'
          >
            <i className='fa fa-history'/> Recents
          </button>
          <button styleName='menu-button'
          >
            <i className='fa fa-star'/> Favorited
          </button>
          <button styleName='menu-button'
          >
            <i className='fa fa-list'/> All posts
          </button>
        </div>

        <div styleName='repositoryList'>
          {repositories.length > 0 ? repositorieElements : (
            <div styleName='repositoryList-empty'>Empty</div>
          )}
        </div>

        <div styleName='control'>
          <button
            styleName='control-newRepositoryButton'
            onClick={(e) => this.handleNewRepositoryButtonClick(e)}
          >
            <i className='fa fa-plus'/> New Repository
          </button>
          <button styleName='control-toggleButton'
          >
            <i className='fa fa-angle-double-right'/>
          </button>
        </div>
      </div>
    )
  }
}

SideNav.propTypes = {
  dispatch: PropTypes.func,
  status: PropTypes.shape({
    folderId: PropTypes.number
  }),
  user: PropTypes.object,
  folders: PropTypes.array,
  allArticles: PropTypes.array,
  articles: PropTypes.array,
  modified: PropTypes.array,
  activeArticle: PropTypes.shape({
    key: PropTypes.string
  }),
  repositories: PropTypes.array
}

export default CSSModules(SideNav, styles)
