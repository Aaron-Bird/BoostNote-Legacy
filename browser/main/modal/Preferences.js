import React, { PropTypes } from 'react'
import { connect, Provider } from 'react-redux'
import linkState from 'browser/lib/linkState'
import store from '../store'
import AppSettingTab from './Preference/AppSettingTab'
import FolderSettingTab from './Preference/FolderSettingTab'
import ContactTab from './Preference/ContactTab'
import { closeModal } from 'browser/lib/modal'

const APP = 'APP'
const FOLDER = 'FOLDER'
const CONTACT = 'CONTACT'

class Preferences extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      currentTab: APP
    }
  }

  switchTeam (teamId) {
    this.setState({currentTeamId: teamId})
  }

  handleNavButtonClick (tab) {
    return e => {
      this.setState({currentTab: tab})
    }
  }

  render () {
    let content = this.renderContent()

    let tabs = [
      {target: APP, label: 'Preferences'},
      {target: FOLDER, label: 'Manage folder'},
      {target: CONTACT, label: 'Contact form'}
    ]

    let navButtons = tabs.map(tab => (
      <button key={tab.target} onClick={e => this.handleNavButtonClick(tab.target)(e)} className={this.state.currentTab === tab.target ? 'active' : ''}>{tab.label}</button>
    ))

    return (
      <div className='Preferences modal'>
        <div className='header'>
          <div className='title'>Setting</div>
          <button onClick={e => closeModal()} className='closeBtn'>Done</button>
        </div>

        <div className='nav'>
          {navButtons}
        </div>

        {content}
      </div>
    )
  }

  renderContent () {
    let { user, folders, dispatch } = this.props

    switch (this.state.currentTab) {
      case FOLDER:
        return (
          <FolderSettingTab
            dispatch={dispatch}
            folders={folders}
          />
        )
      case CONTACT:
        return (
          <ContactTab/>
        )
      case APP:
      default:
        return (
          <AppSettingTab
            user={user}
            dispatch={dispatch}
          />
        )
    }
  }
}

Preferences.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string
  }),
  folders: PropTypes.array,
  dispatch: PropTypes.func
}

Preferences.prototype.linkState = linkState

function remap (state) {
  let { user, folders, status } = state

  return {
    user,
    folders,
    status
  }
}

let RootComponent = connect(remap)(Preferences)
export default class PreferencesModal extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <RootComponent/>
      </Provider>
    )
  }
}
