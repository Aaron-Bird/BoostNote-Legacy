var React = require('react')

var Hq = require('../Services/Hq')

var LinkedState = require('../Mixins/LinkedState')
var KeyCaster = require('../Mixins/KeyCaster')

var PlanetStore = require('../Stores/PlanetStore')

module.exports = React.createClass({
  mixins: [LinkedState, KeyCaster('planetSettingModal')],
  propTypes: {
    close: React.PropTypes.func,
    planet: React.PropTypes.shape({
      name: React.PropTypes.string,
      public: React.PropTypes.bool,
      Owner: React.PropTypes.shape({
        name: React.PropTypes.string
      })
    })
  },
  getInitialState: function () {
    var deleteTextCandidates = [
      'Confirm',
      'Exterminatus',
      'Avada Kedavra'
    ]
    var random = Math.round(Math.random() * 10) % 10
    var randomDeleteText = random > 1 ? deleteTextCandidates[0] : random === 1 ? deleteTextCandidates[1] : deleteTextCandidates[2]

    return {
      currentTab: 'profile',
      planet: {
        name: this.props.planet.name,
        public: this.props.planet.public
      },
      randomDeleteText: randomDeleteText,
      deleteConfirmation: ''
    }
  },
  onKeyCast: function (e) {
    switch (e.status) {
      case 'closeModal':
        this.props.close()
        break
    }
  },
  activePlanetProfile: function () {
    this.setState({currentTab: 'profile'})
  },
  activePlanetDelete: function () {
    this.setState({currentTab: 'delete'})
  },
  handlePublicChange: function (value) {
    return function () {
      this.state.planet.public = value
      this.setState({planet: this.state.planet})
    }.bind(this)
  },
  handleSavePlanetProfile: function (e) {
    var planet = this.props.planet

    this.setState({profileFormStatus: 'sending', profileFormError: null}, function () {
      Hq.updatePlanet(planet.Owner.name, planet.name, this.state.planet)
        .then(function (res) {
          var planet = res.body
          console.log(planet)
          this.setState({profileFormStatus: 'done'})

          PlanetStore.Actions.update(planet)
          this.props.close()
        }.bind(this))
        .catch(function (err) {
          console.error(err)
          var newState = {
            profileFormStatus: 'error'
          }

          if (err.status == null) {
            newState.profileFormError = {message: 'Check your network connection'}
            return this.setState(newState)
          }

          switch (err.status) {
            case 403:
              newState.profileFormError = err.response.body
              this.setState(newState)
              break
            case 422:
              newState.profileFormError = {message: 'Planet name should be Alphanumeric with _, -'}
              this.setState(newState)
              break
            case 409:
              newState.profileFormError = {message: 'The entered name already in use'}
              this.setState(newState)
              break
            default:
              newState.profileFormError = {message: 'Undefined error please try again'}
              this.setState(newState)
          }
        }.bind(this))
    })
  },
  handleDeletePlanetClick: function () {
    var planet = this.props.planet

    this.setState({deleteSubmitStatus: 'sending'}, function () {
      Hq.destroyPlanet(planet.Owner.name, planet.name)
        .then(function (res) {
          var planet = res.body

          PlanetStore.Actions.destroy(planet)
          this.setState({deleteSubmitStatus: 'done'}, function () {
            this.props.close()
          })
        }.bind(this))
        .catch(function (err) {
          this.setState({deleteSubmitStatus: 'error'})
          console.error(err)
        }.bind(this))
    })

  },
  render: function () {
    var content

    content = this.state.currentTab === 'profile' ? this.renderPlanetProfileTab() : this.renderPlanetDeleteTab()

    return (
      <div className='PlanetSettingModal sideNavModal modal'>
        <div className='leftPane'>
          <h1 className='modalLabel'>Planet setting</h1>
          <nav className='tabList'>
            <button onClick={this.activePlanetProfile} className={this.state.currentTab === 'profile' ? 'active' : ''}><i className='fa fa-globe fa-fw'/> Planet profile</button>
            <button onClick={this.activePlanetDelete} className={this.state.currentTab === 'delete' ? 'active' : ''}><i className='fa fa-trash fa-fw'/> Delete Planet</button>
          </nav>
        </div>

        <div className='rightPane'>
          {content}
        </div>
      </div>
    )
  },
  renderPlanetProfileTab: function () {
    return (
      <div className='planetProfileTab tab'>
        <div className='formField'>
          <label>Planet name </label>
          <input valueLink={this.linkState('planet.name')}/>
        </div>

        <div className='formRadioField'>
          <input id='publicOption' checked={this.state.planet.public} onChange={this.handlePublicChange(true)} name='public' type='radio'/> <label htmlFor='publicOption'>Public</label>

          <input id='privateOption' checked={!this.state.planet.public} onChange={this.handlePublicChange(false)} name='public' type='radio'/> <label htmlFor='privateOption'>Private</label>
        </div>
        <div className='formConfirm'>
          <button onClick={this.handleSavePlanetProfile} className='saveButton btn-primary'>Save</button>

          <div className={'alertInfo' + (this.state.profileFormStatus === 'sending' ? '' : ' hide')}>on Sending...</div>

          <div className={'alertError' + (this.state.profileFormStatus === 'error' ? '' : ' hide')}>{this.state.profileFormError != null ? this.state.profileFormError.message : 'Unexpected error occured! please try again'}</div>

          <div className={'alertSuccess' + (this.state.profileFormStatus === 'done' ? '' : ' hide')}>Successfully done!!</div>
        </div>
      </div>
    )
  },
  renderPlanetDeleteTab: function () {
    var disabled = !this.state.deleteConfirmation.match(new RegExp('^' + this.props.planet.Owner.name + '/' + this.props.planet.name + '$'))

    return (
      <div className='planetDeleteTab tab'>
        <p>Are you sure to destroy <strong>'{this.props.planet.Owner.name + '/' + this.props.planet.name}'</strong>?</p>
        <p>If you are sure, write <strong>'{this.props.planet.Owner.name + '/' + this.props.planet.name}'</strong> to input below and click <strong>'{this.state.randomDeleteText}'</strong> button.</p>
        <input valueLink={this.linkState('deleteConfirmation')} placeholder='userName/planetName'/>
        <div className='formConfirm'>
          <button disabled={disabled} onClick={this.handleDeletePlanetClick}>{this.state.randomDeleteText}</button>

          <div className={'alertInfo' + (this.state.deleteSubmitStatus === 'sending' ? '' : ' hide')}>on Sending...</div>

          <div className={'alertError' + (this.state.deleteSubmitStatus === 'error' ? '' : ' hide')}>Connection failed.. Try again.</div>

          <div className={'alertSuccess' + (this.state.deleteSubmitStatus === 'done' ? '' : ' hide')}>Successfully done!!</div>
        </div>
      </div>
    )
  }
})
