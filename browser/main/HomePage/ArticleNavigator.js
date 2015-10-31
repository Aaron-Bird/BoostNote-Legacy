import React, { PropTypes } from 'react'
import { findWhere } from 'lodash'
import { setSearchFilter, switchFolder, switchMode, CREATE_MODE } from 'boost/actions'
import { openModal } from 'boost/modal'
import FolderMark from 'boost/components/FolderMark'
import Preferences from 'boost/components/modal/Preferences'
import CreateNewFolder from 'boost/components/modal/CreateNewFolder'

import remote from 'remote'
let userName = remote.getGlobal('process').env.USER

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
          <div className='userName'>local</div>
          <button onClick={e => this.handlePreferencesButtonClick(e)} className='settingBtn'>
            <i className='fa fa-fw fa-chevron-down'/>
            <span className='tooltip'>Preferences 環境設定</span>
          </button>
        </div>

        <div className='controlSection'>
          <button onClick={e => this.handleNewPostButtonClick(e)} className='newPostBtn'>
            New Post
            <span className='tooltip'>新しいポスト (⌘ + Enter or a)</span>
          </button>
        </div>

        <div className='folders'>
          <div className='header'>
            <div className='title'>Folders</div>
            <button onClick={e => this.handleNewFolderButton(e)} className='addBtn'>
              <i className='fa fa-fw fa-plus'/>
              <span className='tooltip'>New folder 新しいフォルダー</span>
            </button>
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

