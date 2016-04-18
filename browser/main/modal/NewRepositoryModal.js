import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NewRepositoryModal.styl'
import linkState from 'browser/lib/linkState'
import RepositoryManager from 'browser/lib/RepositoryManager'
import store from 'browser/main/store'
import actions from 'browser/main/actions'

const electron = require('electron')
const remote = electron.remote

function browseFolder () {
  let dialog = remote.dialog

  let defaultPath = remote.app.getHomeDir()
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog({
      title: 'Select Directory',
      defaultPath,
      properties: ['openDirectory', 'createDirectory']
    }, function (targetPaths) {
      if (targetPaths == null) return resolve('')
      resolve(targetPaths[0])
    })
  })
}

class NewRepositoryModal extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      path: '',
      isPathSectionFocused: false,
      error: null,
      isBrowsingPath: false
    }
  }

  handleCloseButtonClick (e) {
    this.props.close()
  }

  handlePathFocus (e) {
    this.setState({
      isPathSectionFocused: true
    })
  }

  handlePathBlur (e) {
    if (e.relatedTarget !== this.refs.pathInput && e.relatedTarget !== this.refs.browseButton) {
      this.setState({
        isPathSectionFocused: false
      })
    }
  }

  handleBrowseButtonClick (e) {
    this.setState({
      isBrowsingPath: true
    }, () => {
      browseFolder()
        .then((targetPath) => {
          this.setState({
            path: targetPath,
            isBrowsingPath: false
          })
        })
        .catch((err) => {
          console.error('BrowseFAILED')
          console.error(err)
          this.setState({
            isBrowsingPath: false
          })
        })
    })
  }

  handleConfirmButtonClick (e) {
    let targetPath = this.state.path
    let name = this.state.name

    RepositoryManager
      .addRepo({
        targetPath,
        name
      })
      .then((newRepo) => {
        store.dispatch(actions.addRepo(newRepo))
        this.props.close()
      })
      .catch((err) => {
        console.error(err)
        this.setState({
          error: err.message
        })
      })
  }

  render () {
    return (
      <div className='NewRepositoryModal'
        styleName='root'
      >
        <div styleName='header'>
          <div styleName='header-title'>New Repository</div>
          <button styleName='header-closeButton'
            onClick={(e) => this.handleCloseButtonClick(e)}
          >
            <i className='fa fa-times'/>
          </button>
        </div>
        <div styleName='body'>
          <div styleName='body-section'>
            <div styleName='body-section-label'>Repository Name</div>
            <input styleName='body-section-input'
              ref='nameInput'
              valueLink={this.linkState('name')}
            />
          </div>

          <div styleName='body-section'>
            <div styleName='body-section-label'>Repository Path</div>
            <div styleName={!this.state.isPathSectionFocused ? 'body-section-path' : 'body-section-path--focus'}>
              <input styleName='body-section-path-input'
                valueLink={this.linkState('path')}
                style={styles.body_section_path_input}
                onFocus={(e) => this.handlePathFocus(e)}
                onBlur={(e) => this.handlePathBlur(e)}
                disabled={this.state.isBrowsingPath}
              />
              <button styleName='body-section-path-button'
                onClick={(e) => this.handleBrowseButtonClick(e)}
                onFocus={(e) => this.handlePathFocus(e)}
                onBlur={(e) => this.handlePathBlur(e)}
                disabled={this.state.isBrowsingPath}
              >
                ...
              </button>
            </div>
          </div>
          {
            this.state.error != null && (
              <div styleName='body-error'>
                {this.state.error}
              </div>
            )
          }
        </div>

        <div styleName='footer'>
          <button styleName='footer-cancelButton'
            onClick={(e) => this.handleCloseButtonClick(e)}
          >
            <i className='fa fa-times'/> Cancel
          </button>
          <button styleName='footer-confirmButton'
            onClick={(e) => this.handleConfirmButtonClick(e)}
          >
            <i className='fa fa-check'/> Confirm
          </button>
        </div>
      </div>
    )
  }
}

NewRepositoryModal.propTypes = {
  close: PropTypes.func
}

NewRepositoryModal.prototype.linkState = linkState

export default CSSModules(NewRepositoryModal, styles)
