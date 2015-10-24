import React, { PropTypes } from 'react'
import ProfileImage from 'boost/components/ProfileImage'
import { findWhere } from 'lodash'
import { setSearchFilter, switchFolder, switchMode, CREATE_MODE } from 'boost/actions'
import { openModal } from 'boost/modal'
import FolderMark from 'boost/components/FolderMark'
import Preferences from 'boost/components/modal/Preferences'
import CreateNewFolder from 'boost/components/modal/CreateNewFolder'

export default class ArticleNavigator extends React.Component {
  componentDidMount () {
    this.handlePreferencesButtonClick()
  }

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
    let { activeUser, status } = this.props
    if (activeUser == null) return (<div className='ArticleNavigator'/>)
    let { targetFolders } = status
    if (targetFolders == null) targetFolders = []

    let folders = activeUser.Folders != null
      ? activeUser.Folders.map((folder, index) => {
        let isActive = findWhere(targetFolders, {id: folder.id})

        return (
          <button onClick={e => this.handleFolderButtonClick(folder.name)(e)} key={'folder-' + folder.id} className={isActive ? 'active' : ''}>
          <FolderMark id={folder.id}/> {folder.name} {folder.public ? null : <i className='fa fa-fw fa-lock'/>}</button>
        )
      })
      : []

    let members = Array.isArray(activeUser.Members) ? activeUser.Members.sort((a, b) => {
      return new Date(a._pivot_createdAt) - new Date(b._pivot_createdAt)
    }).map(member => {
      return (
        <div key={'member-' + member.id}>
          <ProfileImage className='memberImage' email={member.email} size='22'/>
          <div className='memberProfileName'>{member.profileName}</div>
        </div>
      )
    }) : null

    return (
      <div className='ArticleNavigator'>
        <div className='userInfo'>
          <div className='userProfileName'>{activeUser.profileName}</div>
          <div className='userName'>{activeUser.name}</div>
          <button onClick={e => this.handlePreferencesButtonClick(e)} className='settingBtn'><i className='fa fa-fw fa-chevron-down'/></button>
        </div>

        <div className='controlSection'>
          <button onClick={e => this.handleNewPostButtonClick(e)} className='newPostBtn'>New Post</button>
        </div>

        <div className='folders'>
          <div className='header'>
            <div className='title'>Folders</div>
            <button onClick={e => this.handleNewFolderButton(e)} className='addBtn'><i className='fa fa-fw fa-plus'/></button>
          </div>
          <div className='folderList'>
            <button onClick={e => this.handleAllFoldersButtonClick(e)} className={targetFolders.length === 0 ? 'active' : ''}>All folders</button>
            {folders}
          </div>
        </div>

        {activeUser.userType === 'team' ? (
          <div className='members'>
            <div className='header'>
              <div className='title'>Members</div>
              <button className='addBtn'><i className='fa fa-fw fa-plus'/></button>
            </div>
            <div className='memberList'>
              {members}
            </div>
          </div>
        ) : null}

      </div>
    )
  }
}

ArticleNavigator.propTypes = {
  activeUser: PropTypes.object,
  status: PropTypes.shape({
    folderId: PropTypes.number
  }),
  dispatch: PropTypes.func
}

