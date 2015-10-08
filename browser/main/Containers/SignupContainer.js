import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import linkState from '../helpers/linkState'
import openExternal from '../helpers/openExternal'

var Hq = require('../Services/Hq')

export default class SignupContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      user: {},
      connectionFailed: false,
      emailConflicted: false,
      nameConflicted: false,
      validationFailed: false,
      isSending: false,
      error: null
    }
    this.linkState = linkState
    this.openExternal = openExternal
  }

  handleSubmit (e) {
    this.setState({
      isSending: true,
      error: null
    }, function () {
      Hq.signup(this.state.user)
        .then(res => {
          localStorage.setItem('token', res.body.token)
          localStorage.setItem('currentUser', JSON.stringify(res.body.user))

          this.props.history.pushState('userHome', {userId: res.body.user.id})
        })
        .catch(function (err) {
          console.error(err)
          if (err.response == null) {
            return this.setState({
              error: {name: 'CunnectionRefused', message: 'API server doesn\'t respond. Check your internet connection.'},
              isSending: false
            })
          }

          // Connection Failed or Whatever
          this.setState({
            error: err.response.body,
            isSending: false
          })
        }.bind(this))
    })

    e.preventDefault()
  }

  render () {
    return (
      <div className='SignupContainer'>
        <img className='logo' src='resources/favicon-230x230.png'/>

        <nav className='authNavigator text-center'><Link to='/login' activeClassName='active'>Log In</Link> / <Link to='/signup' activeClassName='active'>Sign Up</Link></nav>

        <form onSubmit={e => this.handleSubmit(e)}>
          <div className='formField'>
            <input valueLink={this.linkState('user.email')} type='text' placeholder='E-mail'/>
          </div>
          <div className='formField'>
            <input valueLink={this.linkState('user.password')} type='password' placeholder='Password'/>
          </div>
          <div className='formField'>
            <input valueLink={this.linkState('user.name')} type='text' placeholder='name'/>
          </div>
          <div className='formField'>
            <input valueLink={this.linkState('user.profileName')} type='text' placeholder='Profile name'/>
          </div>

          {this.state.isSending ? (
            <p className='alertInfo'>Signing up...</p>
          ) : null}

          {this.state.error != null ? <p className='alertError'>{this.state.error.message}</p> : null}

          <div className='formField'>
            <button className='logInButton' type='submit'>Sign Up</button>
          </div>
        </form>

        <p className='alert'>会員登録することで、<a onClick={this.openExternal} href='http://boostio.github.io/regulations.html'>当サイトの利用規約</a>及び<a onClick={this.openExternal} href='http://boostio.github.io/privacypolicies.html'>Cookieの使用を含むデータに関するポリシー</a>に同意するものとします。</p>
      </div>
    )
  }
}

SignupContainer.propTypes = {
  history: PropTypes.shape({
    pushState: PropTypes.func
  })
}
