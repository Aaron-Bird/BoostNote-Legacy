var React = require('react/addons')
var ReactRouter = require('react-router')

var ModalBase = require('../Components/ModalBase')

var AuthActions = require('../Actions/AuthActions')

var AuthStore = require('../Stores/AuthStore')

var LogOutModal = React.createClass({
  propTypes: {
    close: React.PropTypes.func
  },
  componentDidMount: function () {
    React.findDOMNode(this.refs.cancel).focus()
  },
  submit: function () {
    AuthActions.logout()
  },
  handleKeyDown: function (e) {
    if (e.keyCode === 13 && e.metaKey) {
      this.submit()
      return
    }
    if (e.keyCode === 27) {
      this.props.close()
      return
    }
  },
  render: function () {
    return (
      <div onKeyDown={this.handleKeyDown} className='logOutModal modal'>
        <div className='modal-header'>
          <h1>Logout</h1>
        </div>
        <div className='modal-body'>
          <p>Are you sure to log out?</p>
        </div>
        <div className='modal-footer'>
          <div className='modal-control'>
            <button ref='cancel' onClick={this.props.close} className='btn-default'>Cancel</button>
            <button onClick={this.submit} className='btn-primary'>Logout</button>
          </div>
        </div>
      </div>
    )
  }
})

var UserSettingNavigation = React.createClass({
  propTypes: {
    currentUser: React.PropTypes.shape({
      name: React.PropTypes.string
    }),
    current: React.PropTypes.string,
    changeCurrent: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      isLogOutModalOpen: false
    }
  },
  changeFactory: function (current) {
    return function () {
      this.props.changeCurrent(current)
    }.bind(this)
  },
  openLogOutModal: function () {
    this.setState({isLogOutModalOpen: true})
  },
  closeLogOutModal: function () {
    this.setState({isLogOutModalOpen: false})
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
          <a onClick={this.openLogOutModal}><i className='fa fa-sign-out fa-fw'/> Logout</a>
        </nav>
        <ModalBase close={this.closeLogOutModal} isOpen={this.state.isLogOutModalOpen}>
          <LogOutModal close={this.closeLogOutModal}/>
        </ModalBase>
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
    var currentUser = AuthStore.getUser()

    return (
      <div className='UserSettingContainer'>
        <UserSettingNavigation currentUser={currentUser} current={this.state.current} changeCurrent={this.changeCurrent}/>
        <UserSettingMain currentUser={currentUser} current={this.state.current}/>
      </div>
    )
  }
})
