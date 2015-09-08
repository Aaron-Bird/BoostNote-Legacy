/* global localStorage */

var React = require('react/addons')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link

var AuthFilter = require('../Mixins/AuthFilter')
var LinkedState = require('../Mixins/LinkedState')
var ExternalLink = require('../Mixins/ExternalLink')
var Hq = require('../Services/Hq')
var socket = require('../Services/socket')

module.exports = React.createClass({
  mixins: [LinkedState, ReactRouter.Navigation, AuthFilter.OnlyGuest, ExternalLink],
  getInitialState: function () {
    return {
      user: {},
      connectionFailed: false,
      emailConflicted: false,
      nameConflicted: false,
      validationFailed: false,
      isSending: false
    }
  },
  handleSubmit: function (e) {
    this.setState({
      connectionFailed: false,
      emailConflicted: false,
      nameConflicted: false,
      validationFailed: false,
      isSending: true
    }, function () {
      Hq.signup(this.state.user)
        .then(function (res) {
          localStorage.setItem('token', res.body.token)
          localStorage.setItem('currentUser', JSON.stringify(res.body.user))
          socket.reconnect()

          this.transitionTo('userHome', {userName: res.body.user.name})
        }.bind(this))
        .catch(function (err) {
          console.error(err)
          var res = err.response
          if (err.status === 409) {
            // Confliction
            var emailConflicted = res.body.errors[0].path === 'email'
            var nameConflicted = res.body.errors[0].path === 'name'

            this.setState({
              connectionFailed: false,
              emailConflicted: emailConflicted,
              nameConflicted: nameConflicted,
              validationFailed: false,
              isSending: false
            })
            return
          }

          if (err.status === 422) {
            // Validation Failed
            this.setState({
              connectionFailed: false,
              emailConflicted: false,
              nameConflicted: false,
              validationFailed: {
                errors: res.body.errors.map(function (error) {
                  return error.path
                })
              },
              isSending: false
            })
            return
          }

          // Connection Failed or Whatever
          this.setState({
            connectionFailed: true,
            emailConflicted: false,
            nameConflicted: false,
            validationFailed: false,
            isSending: false
          })
          return
        }.bind(this))
    })

    e.preventDefault()
  },
  render: function () {
    return (
      <div className='SignupContainer'>
        <img className='logo' src='resources/favicon-230x230.png'/>

        <nav className='authNavigator text-center'><Link to='login'>Log In</Link> / <Link to='signup'>Sign Up</Link></nav>

        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <input className='stripInput' valueLink={this.linkState('user.email')} type='text' placeholder='E-mail'/>
          </div>
          <div className='form-group'>
            <input className='stripInput' valueLink={this.linkState('user.password')} type='password' placeholder='Password'/>
          </div>
          <div className='form-group'>
            <input className='stripInput' valueLink={this.linkState('user.name')} type='text' placeholder='name'/>
          </div>
          <div className='form-group'>
            <input className='stripInput' valueLink={this.linkState('user.profileName')} type='text' placeholder='Profile name'/>
          </div>

          {this.state.isSending ? (
            <p className='alertInfo'>Signing up...</p>
          ) : null}

          {this.state.connectionFailed ? (
            <p className='alertError'>Please try again.</p>
          ) : null}

          {this.state.emailConflicted ? (
            <p className='alertError'>E-mail already exists.</p>
          ) : null}

          {this.state.nameConflicted ? (
            <p className='alertError'>Username already exists.</p>
          ) : null}

          {this.state.validationFailed ? (
            <p className='alertError'>Please fill every field correctly: {this.state.validationFailed.errors.join(', ')}</p>
          ) : null}

          <div className='form-group'>
            <button className='logInButton' type='submit'>Sign Up</button>
          </div>
        </form>

        <p className='alert'>会員登録することで、<a onClick={this.openExternal} href='http://boostio.github.io/regulations.html'>当サイトの利用規約</a>及び<a onClick={this.openExternal} href='http://boostio.github.io/privacypolicies.html'>Cookieの使用を含むデータに関するポリシー</a>に同意するものとします。</p>
      </div>
    )
  }
})
