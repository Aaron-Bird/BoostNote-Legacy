import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './SideNav.styl'
import { openModal } from 'browser/main/lib/modal'
import Preferences from '../modals/Preferences'
import RepositorySection from './RepositorySection'
import NewRepositoryModal from '../modals/NewRepositoryModal'
import ConfigManager from 'browser/main/lib/ConfigManager'

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

  handleHomeButtonClick (e) {
    let { router } = this.context
    router.push('/repositories')
  }

  handleStarredButtonClick (e) {
    let { router } = this.context
    router.push('/starred')
  }

  handleToggleButtonClick (e) {
    let { dispatch, config } = this.props

    ConfigManager.set({isSideNavFolded: !config.isSideNavFolded})
    dispatch({
      type: 'SET_IS_SIDENAV_FOLDED',
      isFolded: !config.isSideNavFolded
    })
  }

  render () {
    let { repositories, dispatch, location, config } = this.props

    let isFolded = config.isSideNavFolded
    let isHomeActive = location.pathname.match(/^\/home$/)
    let isStarredActive = location.pathname.match(/^\/starred$/)

    let repositorieElements = repositories
      .map((repo) => {
        return <RepositorySection
          key={repo.key}
          repository={repo}
          dispatch={dispatch}
          isFolded={isFolded}
        />
      })

    return (
      <div
        className='SideNav'
        styleName={isFolded ? 'root-folded' : 'root'}
        tabIndex='1'
      >
        <div styleName='top'>
          <button styleName='top-menu'
            onClick={(e) => this.handleMenuButtonClick(e)}
          >
            <i styleName='top-menu-icon' className='fa fa-navicon fa-fw'/>
            <span styleName='top-menu-label'>Menu</span>
          </button>
        </div>

        <div styleName='menu'>
          <button styleName={isHomeActive ? 'menu-button--active' : 'menu-button'}
            onClick={(e) => this.handleHomeButtonClick(e)}
          >
            <i styleName='menu-button-icon'
              className='fa fa-home fa-fw'
            />
            <span styleName='menu-button-label'>Home</span>
          </button>
          <button styleName={isStarredActive ? 'menu-button--active' : 'menu-button'}
            onClick={(e) => this.handleStarredButtonClick(e)}
          >
            <i styleName='menu-button-icon'
              className='fa fa-star fa-fw'
            />
            <span styleName='menu-button-label'>Starred</span>
          </button>
        </div>

        <div styleName='repositoryList'>
          {repositories.length > 0 ? repositorieElements : (
            <div styleName='repositoryList-empty'>No repository mount.</div>
          )}
        </div>

        <button styleName='navToggle'
          onClick={(e) => this.handleToggleButtonClick(e)}
        >
          {isFolded
            ? <i className='fa fa-angle-double-right'/>
            : <i className='fa fa-angle-double-left'/>
          }
        </button>
      </div>
    )
  }
}

SideNav.contextTypes = {
  router: PropTypes.shape({})
}

SideNav.propTypes = {
  dispatch: PropTypes.func,
  repositories: PropTypes.array
}

export default CSSModules(SideNav, styles)
