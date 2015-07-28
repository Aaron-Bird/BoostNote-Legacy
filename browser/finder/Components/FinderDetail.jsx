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
      if (article.type === 'snippet') {
        return (
          <div className='FinderDetail'>
            <div className='header'>{article.callSign}</div>
            <div className='content'>
              <CodeViewer code={article.content} mode={article.mode}/>
            </div>
          </div>
        )
      } else if (article.type === 'blueprint') {

        return (
          <div className='FinderDetail'>
            <div className='header'>{article.title}</div>
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
