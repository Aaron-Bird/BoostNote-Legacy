/* global localStorage */
var React = require('react/addons')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link

var AuthFilter = require('../Mixins/AuthFilter')
var LinkedState = require('../Mixins/LinkedState')
var Hq = require('../Services/Hq')
var socket = require('../Services/socket')

module.exports = React.createClass({
  mixins: [LinkedState, ReactRouter.Navigation, AuthFilter.OnlyGuest],
  getInitialState: function () {
    return {
      user: {},
      authenticationFailed: false,
      connectionFailed: false,
      isSending: false
    }
  },
  onListen: function (res) {
    if (res.status === 'failedToLogIn') {
      if (res.data.status === 401) {
        // Wrong E-mail or Password
        this.setState({
          authenticationFailed: true,
          connectionFailed: false,
          isSending: false
        })
        return
      }
      // Connection Failed or Whatever
      this.setState({
        authenticationFailed: false,
        connectionFailed: true,
        isSending: false
      })
      return
    }
  },
  handleSubmit: function (e) {
    this.setState({
      authenticationFailed: false,
      connectionFailed: false,
      isSending: true
    }, function () {
      Hq.login(this.state.user)
        .then(function (res) {
          localStorage.setItem('token', res.body.token)
          localStorage.setItem('currentUser', JSON.stringify(res.body.user))
          socket.reconnect()

          this.transitionTo('userHome', {userName: res.body.user.name})
        }.bind(this))
        .catch(function (err) {
          if (err.status === 401) {
            this.setState({
              authenticationFailed: true,
              connectionFailed: false,
              isSending: false
            })
            return
          }
          this.setState({
            authenticationFailed: false,
            connectionFailed: true,
            isSending: false
          })
        }.bind(this))
    })

    e.preventDefault()
  },
  render: function () {
    return (
      <div className='LoginContainer'>
        <img className='logo' src='resources/favicon-230x230.png'/>

        <nav className='authNavigator text-center'><Link to='login'>Log In</Link> / <Link to='signup'>Sign Up</Link></nav>

        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <input className='stripInput' valueLink={this.linkState('user.email')} type='text' placeholder='E-mail'/>
          </div>
          <div className='form-group'>
            <input className='stripInput' valueLink={this.linkState('user.password')} onChange={this.handleChange} type='password' placeholder='Password'/>
          </div>

          {this.state.isSending ? (
            <p className='alertInfo'>Logging in...</p>
          ) : null}

          {this.state.connectionFailed ? (
            <p className='alertError'>Please try again.</p>
          ) : null}

          {this.state.authenticationFailed ? (
            <p className='alertError'>Wrong E-mail or Password.</p>
          ) : null}

          <div className='form-group'>
            <button className='logInButton' type='submit'>Log In</button>
          </div>
        </form>
      </div>
    )
  }
})
