var React = require('react/addons')

var Catalyst = require('../Mixins/Catalyst')

var ProfileImage = require('./ProfileImage')

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
  saveProfile: function () {
    var currentPlanet = this.props.currentPlanet
    PlanetActions.changeName(currentPlanet.userName, currentPlanet.name, this.state.planetName)
  },
  handleChange: function (value) {
    this.setState({userName: value})
  },
  doubleCheckDeletePlanet: function () {
    if (this.state.isDeletePlanetChecked) {
      PlanetActions.deletePlanet(this.props.currentPlanet.userName, this.props.currentPlanet.name)
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

    return (
      <div onClick={this.interceptClick} className='PlanetSettingModal modal'>
        <div className='settingNav'>
          <h1>Planet setting</h1>
          <nav>
            <button className={this.state.currentTab === 'planetProfile' ? 'active' : ''} onClick={this.activePlanetProfile}><i className='fa fa-globe fa-fw'/> Planet profile</button>
          </nav>
        </div>

        <div className='settingBody'>
          {content}
        </div>
      </div>
    )
  }
})
