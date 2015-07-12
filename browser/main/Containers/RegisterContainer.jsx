var React = require('react/addons')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link

var AuthStore = require('../Stores/AuthStore')
var register = require('../Actions/register')

var OnlyGuest = require('../Mixins/OnlyGuest')

module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin, ReactRouter.Navigation, OnlyGuest],
  getInitialState: function () {
    return {
      email: '',
      password: '',
      name: '',
      profileName: ''
    }
  },
  componentDidMount: function () {
    this.unsubscribe = AuthStore.listen(this.onRegister)
  },
  componentWillUnmount: function () {
    this.unsubscribe()
  },
  handleSubmit: function (e) {
    register({
      email: this.state.email,
      password: this.state.password,
      name: this.state.name,
      profileName: this.state.profileName
    })

    e.preventDefault()
  },
  onRegister: function (user) {
    var planet = user.Planets.length > 0 ? user.Planets[0] : null
    if (planet == null) {
      this.transitionTo('user', {userName: user.name})
      return
    }
    this.transitionTo('dashboard', {userName: user.name, planetName: planet.name})
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
          <div className='form-group'>
            <button className='btn-primary' type='submit'>Sign Up</button>
          </div>
        </form>

        <p className='alert'>会員登録することで、当サイトの利用規約及びCookieの使用を含むデータに関するポリシーに同意するものとします。</p>
      </div>
    )
  }
})
