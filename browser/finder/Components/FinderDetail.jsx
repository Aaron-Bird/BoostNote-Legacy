var React = require('react/addons')

var CodeViewer = require('../../main/Components/CodeViewer')

var Markdown = require('../../main/Mixins/Markdown')

module.exports = React.createClass({
  mixins: [Markdown],
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
              <div className='marked' dangerouslySetInnerHTML={{__html: ' ' + this.markdown(article.content)}}></div>
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
