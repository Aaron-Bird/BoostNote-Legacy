import React, { PropTypes } from 'react'
import linkState from 'boost/linkState'
import { createFolder } from 'boost/actions'
import store from 'boost/store'

export default class CreateNewFolder extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      alert: null
    }
  }

  handleCloseButton (e) {
    this.props.close()
  }

  handleConfirmButton (e) {
    let { close } = this.props
    let name = this.state.name
    let input = {
      name
    }

    store.dispatch(createFolder(input))
    try {
    } catch (e) {
      this.setState({alert: {
        type: 'error',
        message: e.message
      }})
      return
    }
    close()
  }

  render () {
    let alert = this.state.alert
    let alertElement = alert != null ? (
        <p className={`alert ${alert.type}`}>
          {alert.message}
        </p>
      ) : null

    return (
      <div className='CreateNewFolder modal'>
        <button onClick={e => this.handleCloseButton(e)} className='closeBtn'><i className='fa fa-fw fa-times'/></button>

        <div className='title'>Create new folder</div>

        <input className='ipt' type='text' valueLink={this.linkState('name')} placeholder='Enter folder name'/>
        {alertElement}

        <button onClick={e => this.handleConfirmButton(e)} className='confirmBtn'>Create</button>
      </div>
    )
  }
}

CreateNewFolder.propTypes = {
  close: PropTypes.func
}

CreateNewFolder.prototype.linkState = linkState
