var React = require('react/addons')
var Select = require('react-select')

var Catalyst = require('../Mixins/Catalyst')

var PlanetActions = require('../Actions/PlanetActions')

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
      isDeletePlanetChecked: false
    }
  },
  activePlanetProfile: function () {
    this.setState({currentTab: 'planetProfile'})

  },
  activeManageMember: function () {
    this.setState({currentTab: 'manageMember'})
  },
  saveProfile: function () {
    var currentPlanet = this.props.currentPlanet
    PlanetActions.changeName(currentPlanet.userName, currentPlanet.name, this.state.planetName)
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
              {this.props.currentPlanet.OwnerId !== user.id ? <button className='btn-default'>Delete</button> : <span className='ownerLabel'>Owner</span>}
            </div>
          </li>
        )
      }.bind(this))

      content = (
        <div className='manageMember'>
          <ul className='userList'>
            {members}
          </ul>
          <div className='addUserForm'>
            <div className='addUserLabel'>Invite user</div>
            <div className='addUserControl'>
              <Select className='addUserSelect'/>
              <button className='addUserSubmit btn-primary'>Invite</button>
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
            <button className={this.state.currentTab === 'planetProfile' ? 'active' : ''} onClick={this.activePlanetProfile}><i className='fa fa-globe'/> Planet profile</button>
            <button className={this.state.currentTab === 'manageMember' ? 'active' : ''} onClick={this.activeManageMember}><i className='fa fa-group'/> Manage member</button>
          </nav>
        </div>

        <div className='settingBody'>
          {content}
        </div>
      </div>
    )
  }
})
