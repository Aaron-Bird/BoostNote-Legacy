import React, { PropTypes } from 'react'
import CodeEditor from 'browser/components/CodeEditor'
import MarkdownPreview from 'browser/components/MarkdownPreview'
import ModeIcon from 'browser/components/ModeIcon'

export default class FinderDetail extends React.Component {
  render () {
    let { activeArticle } = this.props

    if (activeArticle != null) {
      return (
        <div className='FinderDetail'>
          <div className='header'>
            <div className='left'>
            <ModeIcon mode={activeArticle.mode}/> {activeArticle.title}
            </div>
            <div className='right'>
              <button onClick={this.props.saveToClipboard} className='clipboardBtn'>
                <i className='fa fa-clipboard fa-fw'/>
                <span className='tooltip'>Copy to clipboard (Enter)</span>
              </button>
            </div>
          </div>
          <div className='content'>
            {activeArticle.mode === 'markdown'
              ? <MarkdownPreview content={activeArticle.content}/>
              : <CodeEditor readOnly mode={activeArticle.mode} code={activeArticle.content}/>
            }
          </div>
        </div>
      )
    }
    return (
      <div className='FinderDetail'>
        <div className='nothing'>Nothing selected</div>
      </div>
    )
  }
}

FinderDetail.propTypes = {
  activeArticle: PropTypes.shape(),
  saveToClipboard: PropTypes.func
}
