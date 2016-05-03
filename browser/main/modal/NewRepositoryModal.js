import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NewRepositoryModal.styl'
import Repository from 'browser/lib/Repository'
import store from 'browser/main/store'

const electron = require('electron')
const remote = electron.remote

function browseFolder () {
  let dialog = remote.dialog

  let defaultPath = remote.app.getPath('home')
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

  componentDidMount () {
    this.refs.nameInput.focus()
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

    let repository = new Repository({
      name: name,
      path: targetPath
    })

    repository
      .mount()
      .then(() => repository.load())
      .then((data) => {
        store.dispatch({
          type: 'ADD_REPOSITORY',
          repository: data
        })
        this.props.close()
      })
      .catch((err) => {
        console.error(err)
        this.setState({
          error: err.message
        })
      })
  }

  handleChange (e) {
    let name = this.refs.nameInput.value
    let path = this.refs.pathInput.value
    this.setState({
      name,
      path
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
              value={this.state.name}
              onChange={(e) => this.handleChange(e)}
            />
          </div>

          <div styleName='body-section'>
            <div styleName='body-section-label'>Repository Path</div>
            <div styleName={!this.state.isPathSectionFocused ? 'body-section-path' : 'body-section-path--focus'}>
              <input styleName='body-section-path-input'
                ref='pathInput'
                value={this.state.path}
                style={styles.body_section_path_input}
                onFocus={(e) => this.handlePathFocus(e)}
                onBlur={(e) => this.handlePathBlur(e)}
                disabled={this.state.isBrowsingPath}
                onChange={(e) => this.handleChange(e)}
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

export default CSSModules(NewRepositoryModal, styles)
