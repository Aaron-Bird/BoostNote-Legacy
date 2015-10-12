import React, { PropTypes } from 'react'
import ProfileImage from '../../components/ProfileImage'

export default class ArticleNavigator extends React.Component {
  render () {
    let { user } = this.props
    if (user == null) return (<div className='ArticleNavigator'/>)
    console.log(user)
    let folders = user.Folders.map(folder => {
      return (
        <button key={'folder-' + folder.id}><i className='fa fa-fw fa-square'/> {folder.name}</button>
      )
    })

    let members = Array.isArray(user.Members) ? user.Members.sort((a, b) => {
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
          <div className='userProfileName'>{user.profileName}</div>
          <div className='userName'>{user.name}</div>
          <button className='settingBtn'><i className='fa fa-fw fa-chevron-down'/></button>
        </div>

        <div className='controlSection'>
          <button className='newPostBtn'>New Post</button>
        </div>

        <div className='folders'>
          <div className='header'>
            <div className='title'>Folders</div>
            <button className='addBtn'><i className='fa fa-fw fa-plus'/></button>
          </div>
          <div className='folderList'>
            <button>All folders</button>
            {folders}
          </div>
        </div>

        {user.userType === 'team' ? (
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
  user: PropTypes.object
}
