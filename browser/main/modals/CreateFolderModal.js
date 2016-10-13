import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './CreateFolderModal.styl'
import dataApi from 'browser/main/lib/dataApi'
import store from 'browser/main/store'
import consts from 'browser/lib/consts'

class CreateFolderModal extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: ''
    }
  }

  componentDidMount () {
    this.refs.name.focus()
    this.refs.name.select()
  }

  handleCloseButtonClick (e) {
    this.props.close()
  }

  handleChange (e) {
    this.setState({
      name: this.refs.name.value
    })
  }

  handleKeyDown (e) {
    if (e.keyCode === 27) {
      this.props.close()
    }
  }

  handleInputKeyDown (e) {
    switch (e.keyCode) {
      case 13:
        this.confirm()
    }
  }

  handleConfirmButtonClick (e) {
    this.confirm()
  }

  confirm () {
    if (this.state.name.trim().length > 0) {
      let { storage } = this.props
      let input = {
        name: this.state.name.trim(),
        color: consts.FOLDER_COLORS[Math.floor(Math.random() * 7) % 7]
      }

      dataApi.createFolder(storage.key, input)
        .then((data) => {
          store.dispatch({
            type: 'UPDATE_FOLDER',
            storage: data.storage
          })
          this.props.close()
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  render () {
    return (
      <div styleName='root'
        tabIndex='-1'
        onKeyDown={(e) => this.handleKeyDown(e)}
      >
        <div styleName='header'>
          <div styleName='title'>New Folder</div>
        </div>
        <button styleName='closeButton'
          onClick={(e) => this.handleCloseButtonClick(e)}
        >Close</button>

        <div styleName='control'>
          <input styleName='control-input'
            placeholder='Folder Name'
            ref='name'
            value={this.state.name}
            onChange={(e) => this.handleChange(e)}
            onKeyDown={(e) => this.handleInputKeyDown(e)}
          />
          <button styleName='control-confirmButton'
            onClick={(e) => this.handleConfirmButtonClick(e)}
          >
            Confirm
          </button>
        </div>
      </div>
    )
  }
}

CreateFolderModal.propTypes = {
  storage: PropTypes.shape({
    key: PropTypes.string
  })
}

export default CSSModules(CreateFolderModal, styles)
