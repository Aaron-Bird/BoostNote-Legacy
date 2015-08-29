var React = require('react/addons')

var CodeViewer = require('../../main/Components/CodeViewer')

var MarkdownPreview = require('../../main/Components/MarkdownPreview')

module.exports = React.createClass({
  propTypes: {
    currentArticle: React.PropTypes.object
  },
  render: function () {
    var article = this.props.currentArticle

    if (article != null) {
      if (article.type === 'code') {
        return (
          <div className='FinderDetail'>
            <div className='header'><i className='fa fa-code fa-fw'/> {article.description}</div>
            <div className='content'>
              <CodeViewer code={article.content} mode={article.mode}/>
            </div>
          </div>
        )
      } else if (article.type === 'note') {

        return (
          <div className='FinderDetail'>
            <div className='header'><i className='fa fa-file-text-o fa-fw'/> {article.title}</div>
            <div className='content'>
              <MarkdownPreview className='marked' content={article.content}/>
            </div>
          </div>
        )
      }
    }
    return (
      <div className='FinderDetail'>
        <div className='nothing'>Nothing selected</div>
      </div>
    )
  }
})
