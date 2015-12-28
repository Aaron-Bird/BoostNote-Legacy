import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import store from '../store'
import { destroyArticle } from '../actions'

export default class DeleteArticleModal extends React.Component {
  componentDidMount () {
    ReactDOM.findDOMNode(this.refs.no).focus()
  }

  handleNoButtonClick (e) {
    this.props.close()
  }

  handleYesButtonClick (e) {
    store.dispatch(destroyArticle(this.props.articleKey))
    this.props.close()
  }

  render () {
    return (
      <div className='DeleteArticleModal modal'>
        <div className='title'><i className='fa fa-fw fa-trash'/> Delete an article.</div>

        <div className='message'>Do you really want to delete?</div>

        <div className='control'>
          <button ref='no' onClick={e => this.handleNoButtonClick(e)}><i className='fa fa-fw fa-close'/> No</button>
          <button ref='yes' onClick={e => this.handleYesButtonClick(e)} className='danger'><i className='fa fa-fw fa-check'/> Yes</button>
        </div>
      </div>
    )
  }
}

DeleteArticleModal.propTypes = {
  action: PropTypes.object,
  articleKey: PropTypes.string,
  close: PropTypes.func
}
