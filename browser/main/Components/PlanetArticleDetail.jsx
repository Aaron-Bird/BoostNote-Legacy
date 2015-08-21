var React = require('react/addons')
var moment = require('moment')

var CodeViewer = require('./CodeViewer')
var CodeEditModal = require('./CodeEditModal')
var CodeDeleteModal = require('./CodeDeleteModal')
var NoteEditModal = require('./NoteEditModal')
var NoteDeleteModal = require('./NoteDeleteModal')
var MarkdownPreview = require('./MarkdownPreview')
var ProfileImage = require('./ProfileImage')

var Modal = require('../Mixins/Modal')
var ForceUpdate = require('../Mixins/ForceUpdate')

module.exports = React.createClass({
  mixins: [ForceUpdate(60000), Modal],
  propTypes: {
    article: React.PropTypes.object,
    showOnlyWithTag: React.PropTypes.func,
    planet: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      isEditModalOpen: false
    }
  },
  openEditModal: function () {
    switch (this.props.article.type) {
      case 'code' :
        this.openModal(CodeEditModal, {code: this.props.article, planet: this.props.planet})
        break
      case 'note' :
        this.openModal(NoteEditModal, {note: this.props.article, planet: this.props.planet})
    }
  },
  openDeleteModal: function () {
    switch (this.props.article.type) {
      case 'code' :
        this.openModal(CodeDeleteModal, {code: this.props.article, planet: this.props.planet})
        break
      case 'note' :
        this.openModal(NoteDeleteModal, {note: this.props.article, planet: this.props.planet})
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
    if (article.type === 'code') {
      return (
        <div className='PlanetArticleDetail codeDetail'>
          <div className='detailHeader'>
            <div className='itemLeft'>
              <ProfileImage className='profileImage' size='25' email={article.User.email}/>
              <i className='fa fa-file-text-o fa-fw'></i>
            </div>

            <div className='itemRight'>
              <div className='itemInfo'>{moment(article.updatedAt).fromNow()} by <span className='userProfileName'>{article.User.profileName}</span></div>
              <div className='description'>{article.description}</div>
              <div className='tags'><i className='fa fa-tags'/>{tags}</div>
            </div>

            <span className='itemControl'>
              <button onClick={this.openEditModal} className='btn-default btn-square btn-sm'><i className='fa fa-edit fa-fw'></i></button>
              <button onClick={this.openDeleteModal} className='btn-default btn-square btn-sm'><i className='fa fa-trash fa-fw'></i></button>
            </span>
          </div>
          <div className='detailBody'>
            <div className='content'>
              <CodeViewer code={article.content} mode={article.mode}/>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className='PlanetArticleDetail noteDetail'>
        <div className='detailHeader'>
          <div className='itemLeft'>
            <ProfileImage className='profileImage' size='25' email={article.User.email}/>
            <i className='fa fa-file-text-o fa-fw'></i>
          </div>

          <div className='itemRight'>
            <div className='itemInfo'>{moment(article.updatedAt).fromNow()} by <span className='userProfileName'>{article.User.profileName}</span></div>
            <div className='description'>{article.title}</div>
            <div className='tags'><i className='fa fa-tags'/>{tags}</div>
          </div>

          <span className='itemControl'>
            <button onClick={this.openEditModal} className='btn-default btn-square btn-sm'><i className='fa fa-edit fa-fw'></i></button>
            <button onClick={this.openDeleteModal} className='btn-default btn-square btn-sm'><i className='fa fa-trash fa-fw'></i></button>
          </span>
        </div>
        <div className='detailBody'>
          <MarkdownPreview className='content' content={article.content}/>
        </div>
      </div>
    )
  }
})
