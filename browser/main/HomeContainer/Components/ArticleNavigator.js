import React, { PropTypes } from 'react'

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

    let members = Array.isArray(user.Members) ? user.Members.map(member => {
      return (
        <div>{member.profileName}</div>
      )
    }) : null

    return (
      <div className='ArticleNavigator'>
        <div className='userInfo'>
          <div className='userProfileName'>{user.profileName}</div>
          <div className='userName'>{user.name}</div>
          <i className='fa fa-fw fa-chevron-down'/>
        </div>

        <div className='controlSection'>
          <button className='newPostBtn'>New Post</button>
        </div>

        <div className='folders'>
          <div className='foldersHeader'>
            <div className='folderTitle'>Folders</div>
            <button className='addFolderBtn'><i className='fa fa-fw fa-plus'/></button>
          </div>
          <div className='folderList'>
            <button>All folders</button>
            {folders}
          </div>
        </div>

        {user.userType === 'team' ? (
          <div className='members'>
            <div className='header'>
              <div className='title'></div>
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
