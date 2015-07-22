var React = require('react/addons')
var ReactRouter = require('react-router')
var Select = require('react-select')
var request = require('superagent')

var Catalyst = require('../Mixins/Catalyst')

var PlanetActions = require('../Actions/PlanetActions')

var getOptions = function (input, callback) {
  request
    .get('http://localhost:8000/users/search')
    .query({name: input})
    .send()
    .end(function (err, res) {
      if (err) {
        callback(err)
        return
      }
      callback(null, {
          options: res.body.map(function (user) {
            return {
              label: user.name,
              value: user.name
            }
          }),
          complete: false
      })
    })
}

module.exports = React.createClass({
  mixins: [Catalyst.LinkedStateMixin, ReactRouter.State],
  propTypes: {
    close: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      userName: ''
    }
  },
  componentDidMount: function () {
    window.ns = React.findDOMNode(this).querySelector('.Select')
  },
  handleSubmit: function () {
    var userName = this.state.userName
    var params = this.getParams()
    var ownerName = params.userName
    var planetName = params.planetName

    PlanetActions.addUser(ownerName + '/' + planetName, userName)
  },
  handleChange: function (value) {
    this.setState({userName: value})
  },
  stopPropagation: function (e) {
    e.stopPropagation()
  },
  render: function () {
    return (
      <div onClick={this.stopPropagation} className='PlanetAddUserModal modal'>
        <Select
          name='userName'
          value={this.state.userName}
          placeholder='Username'
          asyncOptions={getOptions}
          onChange={this.handleChange}
          className='userNameSelect'
        />

        <button onClick={this.handleSubmit} className='submitButton'><i className='fa fa-check'/></button>
      </div>
    )
  }
})
