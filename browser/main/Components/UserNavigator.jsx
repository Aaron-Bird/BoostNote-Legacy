var React = require('react')
var _ = require('lodash')

module.exports = React.createClass({
  propTypes: {
    createNewArticle: React.PropTypes.func,
    search: React.PropTypes.string,
    user: React.PropTypes.object
  },
  render: function () {
    var user = this.props.user

    var folders = _.isArray(user.Folders) ? user.Folders.map(function (folder) {
      var isActive = this.props.search.match(new RegExp('in:' + folder.name))
      return (
        <button className={'folderButton' + (isActive ? ' active' : '')}><i className='fa fa-fw fa-square'/> {folder.name}</button>
      )
    }.bind(this)) : null

    var members = _.isArray(user.Members) ? user.Members.map(function (member) {
      return <button className='memberButton'>{member.profileName}</button>
    }) : null

    return (
      <div className='UserNavigator'>
        <div className='profile'>
          <div className='profileName'>{user.profileName}</div>
          <div className='name'>{user.name}</div>
          <div className='dropdownIcon'><i className='fa fa-chevron-down'/></div>
        </div>

        <div className='control'>
          <button onClick={this.props.createNewArticle} className='newPostButton'>New Post</button>
        </div>

        <div className='menu'>
          <div className='menuGruop folders'>
            <div className='label'>
              Folders
              <button className='plusButton'><i className='fa fa-plus'/></button>
            </div>
            <button className={'folderButton' + (this.props.search.match(/in:[a-z0-9-_]/) ? '' : ' active')}>All Folders</button>
            {folders}
          </div>

          {user.userType === 'team' ? (
            <div className='members'>{members}</div>
          ) : null}
        </div>
      </div>
    )
  }
})
