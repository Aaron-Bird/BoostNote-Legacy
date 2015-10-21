import React, { PropTypes } from 'react'
import linkState from 'boost/linkState'
import api from 'boost/api'
import { pick } from 'lodash'

export default class CreateNewFolder extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      public: false
    }
  }

  handlePublicButtonClick (value) {
    console.log(value)
    return e => {
      this.setState({public: value})
    }
  }

  handleConfirmButton (e) {
    let { user, close } = this.props
    let input = pick(this.state, ['public', 'name'])
    input.UserId = user.id

    api.createFolder(input)
      .then(res => {
        console.log(res.body)
        close()
      })
      .catch(err => {
        console.log(err)
        var alert
        if (err.code === 'ECONNREFUSED') {
          alert = {
            type: 'error',
            message: 'Can\'t connect to API server.'
          }
        } else if (err.status != null) {
          alert = {
            type: 'error',
            message: err.response.body.message
          }
        } else {
          throw err
        }

        this.setState({alert: alert})
      })
  }

  render () {
    let alert = this.state.alert
    let alertEl = alert != null ? (
        <p className={`alert ${alert.type}`}>
          {alert.message}
        </p>
      ) : null

    return (
      <div className='CreateNewFolder modal'>
        <button className='closeBtn'><i className='fa fa-fw fa-times'/></button>

        <div className='title'>Create new folder</div>

        <input className='ipt' type='text' valueLink={this.linkState('name')} placeholder='Enter folder name'/>

        <div className='public'>
          <button className={!this.state.public ? 'active' : ''} onClick={e => this.handlePublicButtonClick(false)(e)}>Private</button>
          <span className='divider'>/</span>
          <button className={this.state.public ? 'active' : ''} onClick={e => this.handlePublicButtonClick(true)(e)}>Public</button>
        </div>
        {alertEl}

        <button onClick={e => this.handleConfirmButton(e)} className='confirmBtn'>Create</button>
      </div>
    )
  }
}

CreateNewFolder.propTypes = {
  user: PropTypes.shape(),
  close: PropTypes.func
}

CreateNewFolder.prototype.linkState = linkState
