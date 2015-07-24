var React = require('react/addons')
var request = require('superagent')
var Select = require('react-select')

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
  mixins: [Catalyst.LinkedStateMixin],
  propTypes: {
    close: React.PropTypes.func,
    currentPlanet: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      currentTab: 'planetProfile',
      planetName: this.props.currentPlanet.name,
      isDeletePlanetChecked: false,
      userName: ''
    }
  },
  activePlanetProfile: function () {
    this.setState({currentTab: 'planetProfile'})

  },
  activeMembers: function () {
    this.setState({currentTab: 'members'})
  },
  saveProfile: function () {
    var currentPlanet = this.props.currentPlanet
    PlanetActions.changeName(currentPlanet.userName, currentPlanet.name, this.state.planetName)
  },
  handleChange: function (value) {
    this.setState({userName: value})
  },
  addUser: function () {
    PlanetActions.addUser(this.props.currentPlanet.userName + '/' + this.props.currentPlanet.name, this.state.userName)
  },
  removeUser: function (userName) {
    return function () {
      PlanetActions.removeUser(this.props.currentPlanet.userName + '/' + this.props.currentPlanet.name, userName)
    }.bind(this)
  },
  doubleCheckDeletePlanet: function () {
    if (this.state.isDeletePlanetChecked) {
      console.log('delete it')
      return
    }
    this.setState({isDeletePlanetChecked: true})
    React.findDOMNode(this.refs.deleteCancelButton).focus()
  },
  cancelDeletePlanet: function () {
    this.setState({isDeletePlanetChecked: false})
  },
  interceptClick: function (e) {
    e.stopPropagation()
  },
  render: function () {
    var content
    if (this.state.currentTab === 'planetProfile') {
      content = (
        <div className='planetProfile'>
          <div className='planetProfileForm'>
            <label>Planet name </label>
            <input valueLink={this.linkState('planetName')} className='inline-input'/>
            <button onClick={this.saveProfile} className='saveButton btn-primary'>Save</button>
          </div>

          <div className='planetDeleteForm'>
            <div className='planetDeleteControl'>
              <div className={'toggle' + (this.state.isDeletePlanetChecked ? '' : ' hide')}>
                <div className='planetDeleteLabel'>Are you sure to delete this planet?</div>
                <button ref='deleteCancelButton' onClick={this.cancelDeletePlanet} className='cancelButton btn-default'>Cancel</button>
              </div>
              <button onClick={this.doubleCheckDeletePlanet} className='deleteButton btn-primary'>{!this.state.isDeletePlanetChecked ? 'Delete Planet' : 'Confirm'}</button>
            </div>
          </div>
        </div>
      )
    } else {
      var members = this.props.currentPlanet.Users.map(function (user) {
        return (
          <li key={'user-' + user.id}>
            <img className='userPhoto' width='44' height='44' src='../vendor/dummy.jpg'/>
            <div className='userName'>{user.name}</div>
            <div className='userControl'>
              {this.props.currentPlanet.OwnerId !== user.id ? <button onClick={this.removeUser(user.name)} className='btn-default'>Delete</button> : <span className='ownerLabel'>Owner</span>}
            </div>
          </li>
        )
      }.bind(this))

      content = (
        <div className='members'>
          <ul className='userList'>
            {members}
          </ul>
          <div className='addUserForm'>
            <div className='addUserLabel'>Invite user</div>
            <div className='addUserControl'>
              <Select
                name='userName'
                value={this.state.userName}
                placeholder='Username'
                asyncOptions={getOptions}
                onChange={this.handleChange}
                className='addUserSelect'
              />
            <button onClick={this.addUser} className='addUserSubmit btn-primary'>Invite</button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div onClick={this.interceptClick} className='PlanetSettingModal modal'>
        <div className='settingNav'>
          <h1>Planet setting</h1>
          <nav>
            <button className={this.state.currentTab === 'planetProfile' ? 'active' : ''} onClick={this.activePlanetProfile}><i className='fa fa-globe fa-fw'/> Planet profile</button>
            <button className={this.state.currentTab === 'members' ? 'active' : ''} onClick={this.activeMembers}><i className='fa fa-group fa-fw'/> Members</button>
          </nav>
        </div>

        <div className='settingBody'>
          {content}
        </div>
      </div>
    )
  }
})
