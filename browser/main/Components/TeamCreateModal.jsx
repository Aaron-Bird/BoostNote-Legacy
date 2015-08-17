/* global localStorage */

var React = require('react/addons')

var Hq = require('../Services/Hq')

var LinkedState = require('../Mixins/LinkedState')

var UserStore = require('../Stores/UserStore')

module.exports = React.createClass({
  mixins: [LinkedState],
  propTypes: {
    user: React.PropTypes.shape({
      name: React.PropTypes.string
    }),
    transitionTo: React.PropTypes.func,
    close: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      team: {
        name: ''
      }
    }
  },
  handleSubmit: function () {
    Hq.createTeam(this.props.user.name, this.state.team)
      .then(function (res) {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'))
        var team = res.body

        currentUser.Teams.push(team)
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
        UserStore.Actions.update(currentUser)
        this.props.transitionTo('userHome', {userName: team.name})
        this.props.close()
      }.bind(this))
      .catch(function (err) {
        console.error(err)
      })
  },
  render: function () {
    return (
      <div className='TeamCreateModal modal'>
        <input valueLink={this.linkState('team.name')} className='nameInput stripInput' placeholder='Create new team'/>

        <button onClick={this.handleSubmit} className='submitButton'>
          <i className='fa fa-check'/>
        </button>
      </div>
    )
  }
})
