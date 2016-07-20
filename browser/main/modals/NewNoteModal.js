import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NewNoteModal.styl'
import dataApi from 'browser/main/lib/dataApi'
import { hashHistory } from 'react-router'

class NewNoteModal extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  componentDidMount () {
    this.refs.markdownButton.focus()
  }

  handleCloseButtonClick (e) {
    this.props.close()
  }

  handleMarkdownNoteButtonClick (e) {
    let { storage, folder, dispatch, location } = this.props
    dataApi
      .createMarkdownNote(storage, folder, {
        title: '',
        content: ''
      })
      .then((note) => {
        dispatch({
          type: 'CREATE_NOTE',
          note: note
        })
        hashHistory.push({
          pathname: location.pathname,
          query: {key: note.uniqueKey}
        })
        this.props.close()
      })
  }
  handleMarkdownNoteButtonKeyDown (e) {
    if (e.keyCode === 9) {
      e.preventDefault()
      this.refs.snippetButton.focus()
    }
  }

  handleSnippetNoteButtonClick (e) {
    let { storage, folder, dispatch, location } = this.props
    dataApi
      .createSnippetNote(storage, folder, {
        title: '',
        description: '',
        snippets: [{
          name: '',
          mode: 'text',
          content: ''
        }]
      })
      .then((note) => {
        dispatch({
          type: 'CREATE_NOTE',
          note: note
        })
        hashHistory.push({
          pathname: location.pathname,
          query: {key: note.uniqueKey}
        })
        this.props.close()
      })
  }

  handleSnippetNoteButtonKeyDown (e) {
    if (e.keyCode === 9) {
      e.preventDefault()
      this.refs.markdownButton.focus()
    }
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='header'>
          <div styleName='title'>New Note</div>
        </div>
        <button styleName='closeButton'
          onClick={(e) => this.handleCloseButtonClick(e)}
        >Close</button>

        <div styleName='control'>
          <button styleName='control-button'
            onClick={(e) => this.handleMarkdownNoteButtonClick(e)}
            onKeyDown={(e) => this.handleMarkdownNoteButtonKeyDown(e)}
            ref='markdownButton'
          >
            <i styleName='control-button-icon'
              className='fa fa-file-text-o'
            /><br/>
            <span styleName='control-button-label'>Markdown Note</span><br/>
            <span styleName='control-button-description'>It is good for any type of documents. Check List, Code block and Latex block are available.</span>
          </button>

          <button styleName='control-button'
            onClick={(e) => this.handleSnippetNoteButtonClick(e)}
            onKeyDown={(e) => this.handleSnippetNoteButtonKeyDown(e)}
            ref='snippetButton'
          >
            <i styleName='control-button-icon'
              className='fa fa-code'
            /><br/>
            <span styleName='control-button-label'>Snippet Note</span><br/>
            <span styleName='control-button-description'>This format is specialized on managing snippets like Gist. Multiple snippets can be grouped as a note.
            </span>
          </button>

        </div>
        <div styleName='description'><i className='fa fa-arrows-h'/> Tab to switch format</div>

      </div>
    )
  }
}

NewNoteModal.propTypes = {
}

export default CSSModules(NewNoteModal, styles)
