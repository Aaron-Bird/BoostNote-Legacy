var React = require('react/addons')
var Select = require('react-select')

var LinkedState = require('../Mixins/LinkedState')

var Hq = require('../Services/Hq')

var KeyCaster = require('../Mixins/KeyCaster')

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
  mixins: [LinkedState, KeyCaster('addMemberModal')],
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
  onKeyCast: function (e) {
    switch (e.status) {
      case 'closeModal':
        this.props.close()
        break
      case 'submitAddMemberModal':
        this.handleSubmit()
        break
    }
  },
  handleSubmit: function () {
    this.setState({errorMessage: null}, function () {
      Hq
        .addMember(this.props.team.name, {
          userName: this.state.userName,
          role: this.state.role
        })
        .then(function (res) {
          console.log(res.body)
          this.props.close()
        }.bind(this))
        .catch(function (err) {
          console.error(err)
          if (err.status === 403) {
            this.setState({errorMessage: err.response.body.message})
          }
        }.bind(this))
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

        {this.state.errorMessage != null ? (<p className='errorAlert'>{this.state.errorMessage}</p>) : null}

        <button onClick={this.handleSubmit} className='submitButton'><i className='fa fa-check'/></button>
      </div>
    )
  }
})
