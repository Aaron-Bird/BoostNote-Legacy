var React = require('react/addons')
var Select = require('react-select')

var LinkedState = require('../Mixins/LinkedState')

var Hq = require('../Services/Hq')

var UserStore = require('../Stores/UserStore')

var getOptions = function (input, callback) {
  Hq.searchUser(input)
    .then(function (res) {
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
    .catch(function (err) {
      console.error(err)
    })
}

module.exports = React.createClass({
  mixins: [LinkedState],
  propTypes: {
    team: React.PropTypes.object,
    close: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      userName: '',
      role: 'member'
    }
  },
  handleSubmit: function () {
    Hq
      .addMember(this.props.team.name, {
        userName: this.state.userName,
        role: this.state.role
      })
      .then(function (res) {
        console.log(res.body)
        UserStore.Actions.addMember(res.body)
        this.props.close()
      }.bind(this))
      .catch(function (err) {
        console.error(err)
      })
  },
  handleChange: function (value) {
    this.setState({userName: value})
  },
  render: function () {
    return (
      <div className='AddMemberModal modal'>
        <Select
          name='userName'
          value={this.state.userName}
          placeholder='Username to add'
          asyncOptions={getOptions}
          onChange={this.handleChange}
          className='userNameSelect'
        />

        <div className='formField'>
          Add member as
          <select valueLink={this.linkState('role')}>
            <option value={'member'}>Member</option>
            <option value={'owner'}>Owner</option>
          </select>
          role
        </div>

        <button onClick={this.handleSubmit} className='submitButton'><i className='fa fa-check'/></button>
      </div>
    )
  }
})
