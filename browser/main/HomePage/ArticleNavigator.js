import React, { PropTypes } from 'react'
import { findWhere } from 'lodash'
import { setSearchFilter, switchFolder, switchMode, CREATE_MODE } from 'boost/actions'
import { openModal } from 'boost/modal'
import FolderMark from 'boost/components/FolderMark'
import Preferences from 'boost/components/modal/Preferences'
import CreateNewFolder from 'boost/components/modal/CreateNewFolder'

import remote from 'remote'
let userName = remote.getGlobal('process').env.USER

const BRAND_COLOR = '#18AF90'

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

const newPostTutorialElement = (
  <svg width='900' height='900' className='tutorial'>
    <text x='290' y='155' fill={BRAND_COLOR} fontSize='24'>Create a new post!!</text>
    <text x='300' y='180' fill={BRAND_COLOR} fontSize='16'>press `⌘ + Enter` or `a`</text>
    <svg x='130' y='-20' width='400' height='400'>
      <path fill='white' d='M56.2,132.5c11.7-2.9,23.9-6,36.1-4.1c8.7,1.4,16.6,5.5,23.7,10.5c13.3,9.4,24.5,21.5,40.2,27
  c1.8,0.6,2.6-2.3,0.8-2.9c-17.1-6-28.9-20.3-44-29.7c-7-4.4-14.8-7.4-23-8.2c-11.7-1.1-23.3,1.7-34.5,4.5
  C53.6,130.1,54.4,133,56.2,132.5L56.2,132.5 z'/>
    </svg>
    <svg x='130' y='-120' width='400' height='400'>
      <path fill='white' d='M82.6,218c-7.7,4.5-15.3,9.3-22.7,14.3c-1,0.7-0.9,2.4,0.4,2.7c6.2,1.8,11.5,4.8,16.2,9.2
        c1.4,1.3,3.5-0.8,2.1-2.1c-5.1-4.8-10.9-8.1-17.6-10c0.1,0.9,0.2,1.8,0.4,2.7c7.4-5,15-9.8,22.7-14.3
        C85.7,219.7,84.2,217.1,82.6,218L82.6,218z'/>
    </svg>
  </svg>
)

const newFolderTutorialElement = (
  <svg width='800' height='500' className='tutorial'>
    <text x='145' y='110' fill={BRAND_COLOR} fontSize='24'>Create a new folder!!</text>
    <svg x='115' y='-10' width='300' height='400'>
      <path fill='white' d='M36.6,3.7C28.8,8.2,21.3,13,13.9,18c-1,0.7-0.9,2.4,0.4,2.7c6.2,1.8,11.5,4.8,16.2,9.2
c1.4,1.3,3.5-0.8,2.1-2.1c-5.1-4.8-10.9-8.1-17.6-10c0.1,0.9,0.2,1.8,0.4,2.7c7.4-5,15-9.8,22.7-14.3C39.7,5.3,38.2,2.7,36.6,3.7
L36.6,3.7z'/>
      <path fill='white' d='M16.8,21.5c13.3-6.9,29.5-7,42.6,0.6c5.6,3.2,10.4,7.7,14.1,13c3.8,5.4,10.3,16.2,2.2,20.6
c-1.2,0.7-2.5,1.2-3.9,1.6c-1.1,0.4-2.3,0.5-3.4,0.5c-1.3-1.4-2.6-2.8-3.9-4.2c-0.2-4.6,7.5-6,10.5-5.8
c7.4,0.7,13.7,6.2,18.4,11.6c9.4,10.7,14.7,24.3,15.6,38.5c0.1,1.9,3.1,1.9,3,0c-0.9-15.5-6.9-30.4-17.5-41.8
c-6.8-7.3-25.8-19.1-32.3-4.8c-1.9,4.1,0.3,8.5,4.8,9.4c4.6,0.8,11.6-1.8,14.3-5.7c3.6-5.3-0.1-12.8-2.8-17.6
c-3.4-6.1-8.2-11.3-13.8-15.4C50.2,11.6,31,10.9,15.3,19C13.6,19.8,15.1,22.4,16.8,21.5L16.8,21.5z'/>
    </svg>
  </svg>
)

export default class ArticleNavigator extends React.Component {
  handlePreferencesButtonClick (e) {
    openModal(Preferences)
  }

  handleNewPostButtonClick (e) {
    let { dispatch } = this.props

    dispatch(switchMode(CREATE_MODE))
  }

  handleNewFolderButton (e) {
    let { activeUser } = this.props
    openModal(CreateNewFolder, {user: activeUser})
  }

  handleFolderButtonClick (name) {
    return e => {
      let { dispatch } = this.props
      dispatch(switchFolder(name))
    }
  }

  handleAllFoldersButtonClick (e) {
    let { dispatch } = this.props
    dispatch(setSearchFilter(''))
  }

  render () {
    let { status, folders } = this.props
    let { targetFolders } = status
    if (targetFolders == null) targetFolders = []

    let folderElememts = folders.map((folder, index) => {
      let isActive = findWhere(targetFolders, {key: folder.key})

      return (
        <button onClick={e => this.handleFolderButtonClick(folder.name)(e)} key={'folder-' + folder.key} className={isActive ? 'active' : ''}>
          <FolderMark color={folder.color}/> {folder.name}
        </button>
      )
    })

    return (
      <div className='ArticleNavigator'>
        <div className='userInfo'>
          <div className='userProfileName'>{userName}</div>
          <div className='userName'>localStorage</div>
          <button onClick={e => this.handlePreferencesButtonClick(e)} className='settingBtn'>
            <i className='fa fa-fw fa-chevron-down'/>
            <span className='tooltip'>Preferences</span>
          </button>

          {status.isTutorialOpen ? preferenceTutorialElement : null}

        </div>

        <div className='controlSection'>
          <button onClick={e => this.handleNewPostButtonClick(e)} className='newPostBtn'>
            New Post
            <span className='tooltip'>Create a new Post (⌘ + Enter or a)</span>
          </button>

          {status.isTutorialOpen ? newPostTutorialElement : null}

        </div>

        <div className='folders'>
          <div className='header'>
            <div className='title'>Folders</div>
            <button onClick={e => this.handleNewFolderButton(e)} className='addBtn'>
              <i className='fa fa-fw fa-plus'/>
              <span className='tooltip'>Create a new folder</span>
            </button>

            {status.isTutorialOpen ? newFolderTutorialElement : null}

          </div>
          <div className='folderList'>
            <button onClick={e => this.handleAllFoldersButtonClick(e)} className={targetFolders.length === 0 ? 'active' : ''}>All folders</button>
            {folderElememts}
          </div>
        </div>
      </div>
    )
  }
}

ArticleNavigator.propTypes = {
  activeUser: PropTypes.object,
  folders: PropTypes.array,
  status: PropTypes.shape({
    folderId: PropTypes.number
  }),
  dispatch: PropTypes.func
}

