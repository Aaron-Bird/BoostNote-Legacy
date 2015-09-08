/* global localStorage */

var React = require('react')

var socket = require('../Services/socket')

var KeyCaster = require('../Mixins/KeyCaster')

module.exports = React.createClass({
  mixins: [KeyCaster('logoutModal')],
  propTypes: {
    transitionTo: React.PropTypes.func,
    close: React.PropTypes.func
  },
  onKeyCast: function (e) {
    switch (e.status) {
      case 'closeModal':
        this.props.close()
        break
      case 'submitLogoutModal':
        this.logout()
        break
    }
  },
  logout: function () {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
    socket.reconnect()

    this.props.transitionTo('login')
    this.props.close()
  },
  render: function () {
    return (
      <div className='LogoutModal modal'>
        <div className='messageLabel'>Are you sure to log out?</div>
        <div className='formControl'>
          <button onClick={this.props.close}>Cancel</button>
          <button className='logoutButton' onClick={this.logout}>Log out</button>
        </div>
      </div>
    )
  }
})
