var React = require('react/addons')
var moment = require('moment')

var CodeViewer = require('../Components/CodeViewer')

var ForceUpdate = require('../Mixins/ForceUpdate')
var Markdown = require('../Mixins/Markdown')

var PlanetArticleDetail = React.createClass({
  mixins: [ForceUpdate(60000), Markdown],
  propTypes: {
    article: React.PropTypes.object,
    onOpenEditModal: React.PropTypes.func,
    onOpenDeleteModal: React.PropTypes.func,
    showOnlyWithTag: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      isEditModalOpen: false
    }
  },
  render: function () {
    var article = this.props.article
    if (article == null) {
      return (
        <div className='PlanetArticleDetail'>
          Nothing selected
        </div>
      )
    }
    var tags = article.Tags.length > 0 ? article.Tags.map(function (tag) {
      return (
        <a onClick={this.props.showOnlyWithTag(tag.name)} key={tag.id}>#{tag.name}</a>
      )
    }.bind(this)) : (
      <a className='noTag'>Not tagged yet</a>
    )
    if (article.type === 'snippet') {
      return (
        <div className='PlanetArticleDetail snippetDetail'>
          <div className='viewer-header'>
            <i className='fa fa-code fa-fw'></i> {article.callSign} <small className='updatedAt'>{moment(article.updatedAt).fromNow()}</small>
            <span className='control-group'>
              <button onClick={this.props.onOpenEditModal} className='btn-default btn-square btn-sm'><i className='fa fa-edit fa-fw'></i></button>
              <button onClick={this.props.onOpenDeleteModal} className='btn-default btn-square btn-sm'><i className='fa fa-trash fa-fw'></i></button>
            </span>
          </div>
          <div className='viewer-body'>
            <div className='viewer-detail'>
              <div className='description'>{article.description}</div>
              <div className='tags'><i className='fa fa-tags'/>{tags}</div>
            </div>
            <div className='content'>
              <CodeViewer code={article.content} mode={article.mode}/>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className='PlanetArticleDetail blueprintDetail'>
        <div className='viewer-header'>
          <i className='fa fa-file-text-o fa-fw'></i> {article.title} <small className='updatedAt'>{moment(article.updatedAt).fromNow()}</small>
          <span className='control-group'>
            <button onClick={this.props.onOpenEditModal} className='btn-default btn-square btn-sm'><i className='fa fa-edit fa-fw'></i></button>
            <button onClick={this.props.onOpenDeleteModal} className='btn-default btn-square btn-sm'><i className='fa fa-trash fa-fw'></i></button>
          </span>
        </div>
        <div className='viewer-body'>
          <div className='tags'><i className='fa fa-tags'/>{tags}</div>
          <div className='content' dangerouslySetInnerHTML={{__html: ' ' + this.markdown(article.content)}}></div>
        </div>
      </div>
    )
  }
})

module.exports = PlanetArticleDetail
