import React, { PropTypes } from 'react'
import ProfileImage from 'boost/components/ProfileImage'
import { findWhere } from 'lodash'
import { switchMode, CREATE_MODE } from 'boost/actions'
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

  render () {
    let { activeUser, status } = this.props
    if (activeUser == null) return (<div className='ArticleNavigator'/>)

    let activeFolder = findWhere(activeUser.Folders, {id: status.folderId})

    let folders = activeUser.Folders != null
      ? activeUser.Folders.map((folder, index) => {
        return (
          <button key={'folder-' + folder.id} className={activeFolder != null && activeFolder.id === folder.id ? 'active' : ''}>
          <FolderMark id={folder.id}/> {folder.name} {folder.public ? <i className='fa fa-fw fa-lock'/> : null}</button>
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
            <button className={activeFolder == null ? 'active' : ''}>All folders</button>
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

