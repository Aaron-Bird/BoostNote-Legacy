import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './SideNav.styl'
import { openModal } from 'browser/lib/modal'
import Preferences from '../../modal/Preferences'
import RepositorySection from './RepositorySection'
import NewRepositoryModal from '../../modal/NewRepositoryModal'

const electron = require('electron')
const { remote } = electron
const Menu = remote.Menu
const MenuItem = remote.MenuItem

class SideNav extends React.Component {
  // TODO: should not use electron stuff v0.7
  handleMenuButtonClick (e) {
    var menu = new Menu()
    menu.append(new MenuItem({
      label: 'Preferences',
      click: (e) => this.handlePreferencesButtonClick(e)
    }))
    menu.append(new MenuItem({ type: 'separator' }))
    menu.append(new MenuItem({
      label: 'Mount Repository',
      click: (e) => this.handleNewRepositoryButtonClick(e)
    }))
    menu.popup(remote.getCurrentWindow())
  }

  handleNewRepositoryButtonClick (e) {
    openModal(NewRepositoryModal)
  }

  handlePreferencesButtonClick (e) {
    openModal(Preferences)
  }

  render () {
    let { repositories, dispatch } = this.props
    let repositorieElements = repositories.map((repo) => {
      return <RepositorySection
        key={repo.key}
        repository={repo}
        dispatch={dispatch}
      />
    })

    return (
      <div
        className='SideNav'
        styleName='root'
        tabIndex='1'
      >
        <div styleName='top'>
          <button styleName='top-menu'
            onClick={(e) => this.handleMenuButtonClick(e)}
          >
            <i className='fa fa-navicon'/> Menu
          </button>
        </div>

        <div styleName='menu'>
          <button styleName='menu-button'
          >
            <i className='fa fa-home'/> Home
          </button>
          <button styleName='menu-button'
          >
            <i className='fa fa-star'/> Favorited
          </button>
        </div>

        <div styleName='repositoryList'>
          {repositories.length > 0 ? repositorieElements : (
            <div styleName='repositoryList-empty'>No repository mount</div>
          )}
        </div>

        <button styleName='navToggle'>
          <i className='fa fa-angle-double-left'/>
        </button>
      </div>
    )
  }
}

SideNav.propTypes = {
  dispatch: PropTypes.func,
  repositories: PropTypes.array
}

export default CSSModules(SideNav, styles)
