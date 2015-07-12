/* global localStorage */
var React = require('react/addons')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link

var AuthStore = require('../Stores/AuthStore')
var login = require('../Actions/login')

var OnlyGuest = require('../Mixins/OnlyGuest')

module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin, ReactRouter.Navigation, OnlyGuest],
  getInitialState: function () {
    return {
      email: '',
      password: ''
    }
  },
  componentDidMount: function () {
    this.unsubscribe = AuthStore.listen(this.onLogin)
  },
  componentWillUnmount: function () {
    this.unsubscribe()
  },
  handleSubmit: function (e) {
    login({
      email: this.state.email,
      password: this.state.password
    })
    e.preventDefault()
  },
  onLogin: function (user) {
    var planet = user.Planets.length > 0 ? user.Planets[0] : null
    if (planet == null) {
      this.transitionTo('user', {userName: user.name})
      return
    }
    this.transitionTo('dashboard', {userName: user.name, planetName: planet.name})
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
          <div className='form-group'>
            <button className='btn-primary' type='submit'>Log In</button>
          </div>
        </form>
      </div>
    )
  }
})
