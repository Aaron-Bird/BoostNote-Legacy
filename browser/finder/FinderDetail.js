import React, { PropTypes } from 'react'
import CodeEditor from 'boost/components/CodeEditor'
import MarkdownPreview from 'boost/components/MarkdownPreview'
import ModeIcon from 'boost/components/ModeIcon'

export default class FinderDetail extends React.Component {
  render () {
    let { activeArticle } = this.props

    if (activeArticle != null) {
      return (
        <div className='FinderDetail'>
          <div className='header'>
          <ModeIcon mode={activeArticle.mode}/> {activeArticle.title}</div>
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
  activeArticle: PropTypes.shape()
}
