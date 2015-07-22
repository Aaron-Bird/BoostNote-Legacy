var React = require('react/addons')

var PlanetNavigator = React.createClass({
  propTypes: {
    currentPlanet: React.PropTypes.shape({
      name: React.PropTypes.string,
      Users: React.PropTypes.array
    }),
    openLaunchModal: React.PropTypes.func,
    openAddUserModal: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      isLaunchModalOpen: false
    }
  },
  submitLaunchModal: function (ret) {
    console.log(ret)
    this.setState({isLaunchModalOpen: false})
  },
  render: function () {
    var users = this.props.currentPlanet.Users.map(function (user) {
      return (
        <li key={'user-' + user.id}><img width='44' height='44' src='../vendor/dummy.jpg'/></li>
      )
    })

    return (
      <div className='PlanetNavigator'>
        <button onClick={this.props.openLaunchModal} className='launchButton btn-primary btn-block'>
          <i className='fa fa-rocket fa-fw'/> Launch
        </button>
        <nav>
          <a>
            <i className='fa fa-home fa-fw'/> Home
          </a>
          <a>
            <i className='fa fa-code fa-fw'/> Snippets
          </a>
          <a>
            <i className='fa fa-file-text-o fa-fw'/> Blueprints
          </a>
        </nav>
        <div className='usersLabel'>Users</div>
        <ul className='users'>
          {users}
          <li onClick={this.props.openAddUserModal} className='btn-default'><i className='fa fa-plus'/></li>
        </ul>
      </div>
    )
  }
})

module.exports = PlanetNavigator
