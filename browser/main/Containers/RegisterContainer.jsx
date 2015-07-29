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
      name: '',
      profileName: '',
      connectionFailed: false,
      emailConflicted: false,
      nameConflicted: false,
      validationFailed: false,
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
    if (res.status === 'failedToRegister') {
      if (res.data.status === 409) {
        // Confliction
        var emailConflicted = res.data.body.errors[0].path === 'email'
        var nameConflicted = res.data.body.errors[0].path === 'name'

        this.setState({
          connectionFailed: false,
          emailConflicted: emailConflicted,
          nameConflicted: nameConflicted,
          validationFailed: false,
          isSending: false
        })
        return
      } else if (res.data.status === 422) {
        this.setState({
          connectionFailed: false,
          emailConflicted: false,
          nameConflicted: false,
          validationFailed: {
            errors: res.data.body.errors.map(function (error) {
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
      AuthActions.register({
        email: this.state.email,
        password: this.state.password,
        name: this.state.name,
        profileName: this.state.profileName
      })
    })

    e.preventDefault()
  },
  render: function () {
    return (
      <div className='RegisterContainer'>
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
            <input className='stripInput' valueLink={this.linkState('password')} type='password' placeholder='Password'/>
          </div>
          <div className='form-group'>
            <input className='stripInput' valueLink={this.linkState('name')} type='text' placeholder='name'/>
          </div>
          <div className='form-group'>
            <input className='stripInput' valueLink={this.linkState('profileName')} type='text' placeholder='Profile name'/>
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

        <p className='alert'>会員登録することで、当サイトの利用規約及びCookieの使用を含むデータに関するポリシーに同意するものとします。</p>
      </div>
    )
  }
})
