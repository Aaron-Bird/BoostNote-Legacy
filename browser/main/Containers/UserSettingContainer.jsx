var React = require('react/addons')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link

var AuthActions = require('../Actions/AuthActions')

var currentUser = {
  name: 'testcat',
  email: 'testcat@example.com',
  profileName: 'Test Cat'
}

var UserSettingNavigation = React.createClass({
  propTypes: {
    currentUser: React.PropTypes.shape({
      name: React.PropTypes.string
    }),
    current: React.PropTypes.string,
    changeCurrent: React.PropTypes.func
  },
  changeFactory: function (current) {
    return function () {
      this.props.changeCurrent(current)
    }.bind(this)
  },
  logOut: function () {
    AuthActions.logout()
  },
  render: function () {
    return (
      <div className='UserSettingNavigation'>
        <div className='userName'>{this.props.currentUser.name}</div>
        <nav>
          <a className={this.props.current === 'profile' ? 'active' : ''} onClick={this.changeFactory('profile')}><i className='fa fa-user fa-fw'/> Profile</a>
          <a className={this.props.current === 'setting' ? 'active' : ''} onClick={this.changeFactory('setting')}><i className='fa fa-gears fa-fw'/> Setting</a>
          <a className={this.props.current === 'integration' ? 'active' : ''} onClick={this.changeFactory('integration')}><i className='fa fa-share-alt fa-fw'/> Integration</a>
          <a className={this.props.current === 'help' ? 'active' : ''} onClick={this.changeFactory('help')}><i className='fa fa-info-circle fa-fw'/> Help</a>
          <a onClick={this.logOut}><i className='fa fa-sign-out fa-fw'/> Logout</a>
        </nav>
      </div>
    )
  }
})

var UserSettingMain = React.createClass({
  propTypes: {
    currentUser: React.PropTypes.shape({
      name: React.PropTypes.string
    }),
    current: React.PropTypes.string
  },
  render: function () {
    var view

    switch (this.props.current) {
      case 'profile':
        view = (
          <div>
            <h1>User Info</h1>
            <form>
              <div>
                <label>Name</label> <input className='inline-input'/>
              </div>
              <div>
                <label>Mail</label> <input className='inline-input'/>
              </div>
              <div>
                <button className='btn-primary'>Save</button>
              </div>
            </form>
            <hr/>
            <h1>Password Reset</h1>
            <form>
              <div>
                <label>Name</label> <input className='inline-input'/>
              </div>
              <div>
                <label>Mail</label> <input className='inline-input'/>
              </div>
              <div>
                <button className='btn-primary'>Save</button>
              </div>
            </form>
          </div>
        )
        break
      default:
        view = (
          <div>
            Missing...
          </div>
        )
        break
    }
    return (
      <div className='UserSettingMain'>
        {view}
      </div>
    )
  }
})

module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin, ReactRouter.Navigation],
  getInitialState: function () {
    return {
      current: 'profile'
    }
  },
  changeCurrent: function (current) {
    this.setState({
      current: current
    })
  },
  render: function () {
    return (
      <div className='UserSettingContainer'>
        <UserSettingNavigation currentUser={currentUser} current={this.state.current} changeCurrent={this.changeCurrent}/>
        <UserSettingMain currentUser={currentUser} current={this.state.current}/>
      </div>
    )
  }
})
