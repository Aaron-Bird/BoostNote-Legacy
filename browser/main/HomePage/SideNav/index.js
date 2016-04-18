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

const BRAND_COLOR = '#18AF90'
const OSX = global.process.platform === 'darwin'

const preferenceTutorialElement = (
  <svg width='300' height='300' className='tutorial'>
    <text x='15' y='30' fill={BRAND_COLOR} fontSize='24'>Preference</text>
    <svg x='-30' y='-270' width='400' height='400'>
      <path fill='white' d='M165.9,297c5.3,0,10.6,0.1,15.8,0.1c3.3,0,7.7,0.8,10.7-1c2.3-1.4,3.1-4,4.5-6.2c3.5-5.5,9.6-5.2,14.6-1.9
c4.6,3.1,8.7,8,8.4,13.8c-0.3,5.2-3.3,10.1-6.1,14.3c-3.1,4.7-6.6,7-12.2,7.9c-5.2,0.8-11.7,1.6-15.4-3
c-6.6-8.2,2.1-20.5,7.4-27.1c6.5-8.1,20.1-14,26.4-2.1c5.4,10.3-3.1,21.7-13,24.8c-5.7,1.8-11,0.9-16.2-1.9c-2-1.1-5-2.6-6.6-4.4
c-3.9-4.3-0.3-8.2,2.5-11.2c1.3-1.4-0.8-3.6-2.1-2.1c-2.7,2.9-5.8,6.6-5.1,10.9c0.7,4.4,5.6,6.9,9,8.9c8.6,5.1,18.7,4.8,26.8-1.2
c7.3-5.4,11.6-15,8-23.7c-3.3-8.1-11.7-11.8-20-9c-12.5,4.1-33.7,33.5-15.9,43.1c6.8,3.7,19.8,1.8,25.3-3.6
c6.1-5.8,12.1-17.2,9.5-25.7c-2.6-8.4-13.7-17-22.6-13.3c-1.6,0.7-3,1.7-4.1,3c-1.6,1.9-2.2,5.1-4.1,6.6c-3.1,2.4-10.1,1-13.7,1
c-4,0-7.9,0-11.9-0.1C164,294,164,297,165.9,297L165.9,297z'/>
    </svg>
  </svg>
)

const newFolderTutorialElement = (
  <svg width='800' height='500' className='tutorial'>
    <text x='30' y='110' fill={BRAND_COLOR} fontSize='24'>Create a new folder!!</text>
    <text x='50' y='135' fill={BRAND_COLOR} fontSize='16'>{'press ' + (OSX ? '`⌘ + Shift + n`' : '`^ + Shift + n`')}</text>
    <svg x='50' y='10' width='300' height='400'>
      <path fill='white' d='M94.1,10.9C77.7,15.6,62,22.7,47.8,32.1c-13.6,9-27.7,20.4-37.1,33.9c-1.1,1.6,1.5,3.1,2.6,1.5
        C22.6,54.1,37,42.7,50.6,33.8c13.7-8.8,28.6-15.5,44.2-20C96.7,13.3,95.9,10.4,94.1,10.9L94.1,10.9z'/>
      <path fill='white' d='M71.1,8.6c7.9,1.6,15.8,3.2,23.6,4.7c-0.1-0.9-0.2-1.8-0.4-2.7c-4.6,3.4-5.4,7.7-4.4,13.2
        c0.8,4.4,0.8,10.9,5.6,12.8c1.8,0.7,2.6-2.2,0.8-2.9c-2.3-1-2.6-6.2-3-8.3c-0.9-4.5-1.7-9,2.5-12.1c0.9-0.7,1-2.5-0.4-2.7
        C87.5,9,79.6,7.4,71.8,5.9C70,5.4,69.2,8.3,71.1,8.6L71.1,8.6z'/>
    </svg>
  </svg>
)

class SideNav extends React.Component {
  constructor (props) {
    super(props)
    this.newFolderHandler = e => {
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
    return e => {
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
    let { repositories } = this.props
    let repositorieElements = repositories.map((repo) => {
      return <Repository
        key={repo.name}
        repository={repo}
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
