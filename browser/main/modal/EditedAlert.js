import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import store from 'boost/store'
import { unlockStatus, clearNewArticle } from 'boost/actions'

export default class EditedAlert extends React.Component {
  componentDidMount () {
    ReactDOM.findDOMNode(this.refs.no).focus()
  }

  handleNoButtonClick (e) {
    this.props.close()
  }

  handleYesButtonClick (e) {
    store.dispatch(unlockStatus())
    store.dispatch(this.props.action)
    store.dispatch(clearNewArticle())
    this.props.close()
  }

  render () {
    return (
      <div className='EditedAlert modal'>
        <div className='title'>Your article is still editing!</div>

        <div className='message'>Do you really want to leave without finishing?</div>

        <div className='control'>
          <button ref='no' onClick={e => this.handleNoButtonClick(e)}><i className='fa fa-fw fa-close'/> No</button>
          <button ref='yes' onClick={e => this.handleYesButtonClick(e)} className='primary'><i className='fa fa-fw fa-check'/> Yes</button>
        </div>
      </div>
    )
  }
}

EditedAlert.propTypes = {
  action: PropTypes.object,
  close: PropTypes.func
}
