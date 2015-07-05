var React = require('react/addons')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link
var Auth = require('../Services/Auth')

module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin, ReactRouter.Navigation],
  getInitialState: function () {
    return {
      email: '',
      password: ''
    }
  },
  handleSubmit: function (e) {
    console.log(this.state)
    Auth.attempt()
    // TODO: request user data
      .then(function (user) {
        this.transitionTo('dashboard', {planetName: user.name})
      }.bind(this))
    e.preventDefault()
  },
  render: function () {
    return (
      <div className='LoginContainer'>
        <h1 className='text-center'>CodeXen</h1>
        <h2 className='text-center'>Log In | <small><Link to='register'>Register</Link></small></h2>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label>E-mail</label>
            <input valueLink={this.linkState('email')} type='text' placeholder='E-mail'/>
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input valueLink={this.linkState('password')} onChange={this.handleChange} type='password' placeholder='Password'/>
          </div>
          <div className='form-group'>
            <button className='btn-primary btn-block' type='submit'><i className='fa fa-sign-in'></i> Login</button>
          </div>
        </form>
      </div>
    )
  }
})
