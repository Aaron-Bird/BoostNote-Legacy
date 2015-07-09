var React = require('react/addons')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link
var Auth = require('../Services/Auth')

module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin, ReactRouter.Navigation],
  getInitialState: function () {
    return {
      email: '',
      password: '',
      name: '',
      profileName: ''
    }
  },
  handleSubmit: function (e) {
    Auth.register()
    // TODO: request user data
      .then(function (user) {
        this.transitionTo('dashboard', {userName: user.name, planetName: user.name})
      }.bind(this))

    e.preventDefault()
  },
  render: function () {
    return (
      <div className='RegisterContainer'>
        <h1 className='text-center'>CodeXen</h1>
        <h2 className='text-center'><small><Link to='login'>Log In</Link></small> | Register</h2>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label>E-mail</label>
            <input className='block-input' valueLink={this.linkState('email')} type='text' placeholder='E-mail'/>
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input className='block-input' valueLink={this.linkState('password')} type='password' placeholder='Password'/>
          </div>
          <hr></hr>
          <div className='form-group'>
            <label>User name</label>
            <input className='block-input' valueLink={this.linkState('name')} type='text' placeholder='name'/>
          </div>
          <div className='form-group'>
            <label>Profile name</label>
            <input className='block-input' valueLink={this.linkState('profileName')} type='text' placeholder='Profile name'/>
          </div>
          <div className='form-group'>
            <button className='btn-primary btn-block' type='submit'><i className='fa fa-sign-in'></i> Register</button>
          </div>
        </form>
      </div>
    )
  }
})
