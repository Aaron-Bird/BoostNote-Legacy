/* global localStorage */

var React = require('react')

module.exports = React.createClass({
  propTypes: {
    transitionTo: React.PropTypes.func,
    close: React.PropTypes.func
  },
  logout: function () {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
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
