import React from 'react'
import ReactDOM from 'react-dom'
import { getClientKey } from 'boost/activityRecord'
import linkState from 'boost/linkState'
import _ from 'lodash'
import { request, WEB_URL } from 'boost/api'

const FORM_MODE = 'FORM_MODE'
const DONE_MODE = 'DONE_MODE'

export default class ContactTab extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      title: '',
      content: '',
      email: '',
      mode: FORM_MODE,
      alert: null
    }
  }

  componentDidMount () {
    let titleInput = ReactDOM.findDOMNode(this.refs.title)
    if (titleInput != null) titleInput.focus()
  }

  handleBackButtonClick (e) {
    this.setState({
      mode: FORM_MODE
    })
  }

  handleSendButtonClick (e) {
    let input = _.pick(this.state, ['title', 'content', 'email'])
    input.clientKey = getClientKey()

    this.setState({
      alert: {
        type: 'info',
        message: 'Sending...'
      }
    }, () => {
      request.post(WEB_URL + 'apis/inquiry')
        .send(input)
        .then(res => {
          console.log('sent')
          this.setState({
            title: '',
            content: '',
            mode: DONE_MODE,
            alert: null
          })
        })
        .catch(err => {
          if (err.code === 'ECONNREFUSED') {
            this.setState({
              alert: {
                type: 'error',
                message: 'Can\'t connect to API server.'
              }
            })
          } else {
            console.error(err)
            this.setState({
              alert: {
                type: 'error',
                message: err.message
              }
            })
          }
        })
    })
  }

  render () {
    switch (this.state.mode) {
      case DONE_MODE:
        return (
          <div className='ContactTab content done'>
            <div className='message'>
              <i className='checkIcon fa fa-check-circle'/><br/>
              Your message has been sent successfully!!
            </div>
            <div className='control'>
              <button onClick={e => this.handleBackButtonClick(e)}>Back to Contact form</button>
            </div>
          </div>
        )
      case FORM_MODE:
      default:
        let alertElement = this.state.alert != null
          ? (
            <div className={'alert ' + this.state.alert.type}>{this.state.alert.message}</div>
          )
          : null
        return (
          <div className='ContactTab content form'>
            <div className='title'>Contact form</div>
            <div className='description'>
              Your feedback is highly appreciated and will help us to improve our app. :D
            </div>
            <div className='iptGroup'>
              <input ref='title' valueLink={this.linkState('title')} placeholder='Title' type='text'/>
            </div>
            <div className='iptGroup'>
              <textarea valueLink={this.linkState('content')} placeholder='Content'/>
            </div>
            <div className='iptGroup'>
              <input valueLink={this.linkState('email')} placeholder='E-mail (Optional)' type='email'/>
            </div>
            <div className='formControl'>
              <button onClick={e => this.handleSendButtonClick(e)} className='primary'>Send</button>
              {alertElement}
            </div>
          </div>
        )
    }
  }
}

ContactTab.prototype.linkState = linkState
