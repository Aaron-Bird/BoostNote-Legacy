var React = require('react/addons')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link

var AuthActions = require('../Actions/AuthActions')

var AuthStore = require('../Stores/AuthStore')

var OnlyGuest = require('../Mixins/OnlyGuest')

module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin, ReactRouter.Navigation, OnlyGuest],
  getInitialState: function () {
    return {
      email: '',
      password: '',
      authenticationFailed: false,
      connectionFailed: false,
      isSending: false
    }
  },
  componentDidMount: function () {
    this.unsubscribe = AuthStore.listen(this.onListen)
  },
  componentWillUnmount: function () {
    this.unsubscribe()
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
      AuthActions.login({
        email: this.state.email,
        password: this.state.password
      })
    })

    e.preventDefault()
  },
  render: function () {
    return (
      <div className='LoginContainer'>
        <img className='logo' src='resources/favicon-230x230.png'/>

        <nav className='authNavigator text-center'><Link to='login'>Log In</Link> / <Link to='register'>Sign Up</Link></nav>

        <div className='socialControl'>
          <p>Connect with</p>
          <button className='facebookBtn'><i className='fa fa-facebook fa-fw'/></button>
          <button className='githubBtn'><i className='fa fa-github fa-fw'/></button>
        </div>

        <div className='divider'>
          <hr/>
          <div className='dividerLabel'>or</div>
        </div>

        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <input className='stripInput' valueLink={this.linkState('email')} type='text' placeholder='E-mail'/>
          </div>
          <div className='form-group'>
            <input className='stripInput' valueLink={this.linkState('password')} onChange={this.handleChange} type='password' placeholder='Password'/>
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
