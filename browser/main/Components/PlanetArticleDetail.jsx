var React = require('react/addons')
var moment = require('moment')

var CodeViewer = require('../Components/CodeViewer')
var ModalBase = require('../Components/ModalBase')
var SnippetEditModal = require('../Components/SnippetEditModal')
var SnippetDeleteModal = require('../Components/SnippetDeleteModal')
var BlueprintEditModal = require('../Components/BlueprintEditModal')
var BlueprintDeleteModal = require('../Components/BlueprintDeleteModal')

var ForceUpdate = require('../Mixins/ForceUpdate')
var Markdown = require('../Mixins/Markdown')

var PlanetArticleDetail = React.createClass({
  mixins: [ForceUpdate(60000), Markdown],
  propTypes: {
    article: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      isEditModalOpen: false
    }
  },
  openEditModal: function () {
    this.setState({isEditModalOpen: true})
  },
  closeEditModal: function () {
    this.setState({isEditModalOpen: false})
  },
  submitEditModal: function () {
    this.setState({isEditModalOpen: false})
  },
  openDeleteModal: function () {
    this.setState({isDeleteModalOpen: true})
  },
  closeDeleteModal: function () {
    this.setState({isDeleteModalOpen: false})
  },
  submitDeleteModal: function () {
    this.setState({isDeleteModalOpen: false})
  },
  render: function () {
    var article = this.props.article

    var tags = article.Tags.length > 0 ? article.Tags.map(function (tag) {
      return (
        <a key={tag.id} href>#{tag.name}</a>
      )
    }) : (
      <a className='noTag'>Not tagged yet</a>
    )
    if (article.type === 'snippet') {
      return (
        <div className='PlanetArticleDetail snippetDetail'>
          <div className='viewer-header'>
            <i className='fa fa-code fa-fw'></i> {article.callSign} <small className='updatedAt'>{moment(article.updatedAt).fromNow()}</small>
            <span className='control-group'>
              <button onClick={this.openEditModal} className='btn-default btn-square btn-sm'><i className='fa fa-edit fa-fw'></i></button>
              <button onClick={this.openDeleteModal} className='btn-default btn-square btn-sm'><i className='fa fa-trash fa-fw'></i></button>
            </span>

            <ModalBase isOpen={this.state.isEditModalOpen} close={this.closeEditModal}>
              <SnippetEditModal snippet={article} submit={this.submitEditModal} close={this.closeEditModal}/>
            </ModalBase>

            <ModalBase isOpen={this.state.isDeleteModalOpen} close={this.closeDeleteModal}>
              <SnippetDeleteModal snippet={article} submit={this.submitDeleteModal} close={this.closeDeleteModal}/>
            </ModalBase>
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
            <button onClick={this.openEditModal} className='btn-default btn-square btn-sm'><i className='fa fa-edit fa-fw'></i></button>
            <button onClick={this.openDeleteModal} className='btn-default btn-square btn-sm'><i className='fa fa-trash fa-fw'></i></button>
          </span>

          <ModalBase isOpen={this.state.isEditModalOpen} close={this.closeEditModal}>
            <BlueprintEditModal blueprint={article} submit={this.submitEditModal} close={this.closeEditModal}/>
          </ModalBase>

          <ModalBase isOpen={this.state.isDeleteModalOpen} close={this.closeDeleteModal}>
            <BlueprintDeleteModal blueprint={article} submit={this.submitDeleteModal} close={this.closeDeleteModal}/>
          </ModalBase>
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
