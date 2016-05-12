import React, { PropTypes } from 'react'
import { connect, Provider } from 'react-redux'
import linkState from 'browser/lib/linkState'
import store from 'browser/main/store'
import AppSettingTab from './AppSettingTab'
import ContactTab from './ContactTab'
import { closeModal } from 'browser/lib/modal'

const APP = 'APP'
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
    return (e) => {
      this.setState({currentTab: tab})
    }
  }

  render () {
    let content = this.renderContent()

    let tabs = [
      {target: APP, label: 'Preferences'},
      {target: CONTACT, label: 'Contact'}
    ]

    let navButtons = tabs.map((tab) => (
      <button key={tab.target} onClick={(e) => this.handleNavButtonClick(tab.target)(e)} className={this.state.currentTab === tab.target ? 'active' : ''}>{tab.label}</button>
    ))

    return (
      <div className='Preferences modal'>
        <div className='header'>
          <div className='title'>Setting</div>
          <button onClick={(e) => closeModal()} className='closeBtn'>Done</button>
        </div>

        <div className='nav'>
          {navButtons}
        </div>

        {content}
      </div>
    )
  }

  renderContent () {
    let { user, dispatch } = this.props

    switch (this.state.currentTab) {
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
  dispatch: PropTypes.func
}

Preferences.prototype.linkState = linkState

let RootComponent = connect((x) => x)(Preferences)
export default class PreferencesModal extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <RootComponent/>
      </Provider>
    )
  }
}
