var React = require('react')
var moment = require('moment')
var _ = require('lodash')

var CodeEditor = require('./CodeEditor')
var MarkdownPreview = require('./MarkdownPreview')
var ModeIcon = require('./ModeIcon')
var Select = require('react-select')

var Modal = require('../Mixins/Modal')
var ForceUpdate = require('../Mixins/ForceUpdate')
var LinkedState = require('../Mixins/LinkedState')

var aceModes = require('../../../modules/ace-modes')

var modeOptions = aceModes.map(function (mode) {
  return {
    label: mode,
    value: mode
  }
})

module.exports = React.createClass({
  mixins: [ForceUpdate(60000), Modal, LinkedState],
  propTypes: {
    currentArticle: React.PropTypes.object,
    showOnlyWithTag: React.PropTypes.func,
    planet: React.PropTypes.object,
    switchDetailMode: React.PropTypes.func,
    user: React.PropTypes.shape({
      id: React.PropTypes.number,
      name: React.PropTypes.string,
      Folders: React.PropTypes.array
    }),
    article: React.PropTypes.object,
    saveCurrentArticle: React.PropTypes.func,
    detailMode: React.PropTypes.string
  },
  getInitialState: function () {
    var article = this.props.currentArticle != null ? {
      id: this.props.currentArticle.id,
      title: this.props.currentArticle.title,
      content: this.props.currentArticle.CurrentRevision.title,
      tags: this.props.currentArticle.Tags.map(function (tag) {
        return tag.name
      }),
      mode: this.props.currentArticle.mode,
      status: this.props.currentArticle.status
    } : null
    // console.log('init staet')
    // console.log(article)
    return {
      isEditModalOpen: false,
      article: article
    }
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.detailMode === 'edit') {
      var article = {
        id: nextProps.currentArticle.id,
        title: nextProps.currentArticle.title,
        content: nextProps.currentArticle.CurrentRevision.content,
        tags: nextProps.currentArticle.Tags.map(function (tag) {
          return tag.name
        }),
        mode: nextProps.currentArticle.mode,
        FolderId: nextProps.currentArticle.FolderId,
        status: nextProps.currentArticle.status
      }
      this.setState({article: article})
    }
  },
  openDeleteModal: function () {
    if (this.props.article == null) return
  },
  handleFolderIdChange: function (FolderId) {
    this.state.article.FolderId = FolderId
    this.setState({article: this.state.article})
  },
  handleTagsChange: function (tag, tags) {
    tags = _.uniq(tags, function (tag) {
      return tag.value
    })

    this.state.article.tags = tags.map(function (tag) {
      return tag.value
    })
    this.setState({article: this.state.article})
  },
  handleModeChange: function (mode) {
    this.state.article.mode = mode
    this.setState({article: this.state.article})
  },
  handleContentChange: function (e, value) {
    var article = this.state.article
    article.content = value
    this.setState({article: article})
  },
  saveArticle: function () {
    if (this.state.article.mode === '') {
      return this.refs.mode.focus()
    }
    if (this.state.article.FolderId === '') {
      return this.refs.folder.focus()
    }
    this.props.saveCurrentArticle(this.state.article)
  },
  render: function () {
    if (this.props.currentArticle == null) {
      return (
        <div className='ArticleDetail'>
          Nothing selected
        </div>
      )
    }

    if (this.props.detailMode === 'show') {
      return this.renderViewer()
    }
    if (this.state.article == null) {
      return (
        <div className='ArticleDetail'>
          Nothing selected
        </div>
      )
    }
    return this.renderEditor()
  },
  renderEditor: function () {
    var article = this.state.article

    var folderOptions = this.props.user.Folders.map(function (folder) {
      return {
        label: folder.name,
        value: folder.id
      }
    })

    return (
      <div className='ArticleDetail edit'>
        <div className='detailInfo'>
          <div className='left'>
            <Select ref='folder' onChange={this.handleFolderIdChange} clearable={false} options={folderOptions} placeholder='select folder...' value={article.FolderId} className='folder'/>
            <Select onChange={this.handleTagsChange} clearable={false} multi={true} placeholder='add some tags...' allowCreate={true} value={article.tags} className='tags'/>
          </div>
          <div className='right'>
            <button onClick={this.props.switchDetailMode('show')}>Cancel</button>
            <button onClick={this.saveArticle} className='primary'>Save</button>
          </div>
        </div>
        <div className='detailBody'>
          <div className='detailPanel'>
            <div className='header'>
              <div className='title'>
                <input ref='title' valueLink={this.linkState('article.title')}/>
              </div>
              <Select ref='mode' onChange={this.handleModeChange} clearable={false} options={modeOptions}placeholder='select mode...' value={article.mode} className='mode'/>
            </div>
            <CodeEditor onChange={this.handleContentChange} mode={article.mode} code={article.content}/>
          </div>
        </div>
      </div>
    )
  },
  renderViewer: function () {
    var article = this.props.currentArticle
    var tags = article.Tags.length > 0 ? article.Tags.map(function (tag) {
      return (
        <a key={tag.id}>{tag.name}</a>
      )
    }) : (
      <span className='noTags'>Not tagged yet</span>
    )

    var folder = _.findWhere(this.props.user.Folders, {id: article.FolderId})
    var folderName = folder != null ? folder.name : null

    return (
      <div className='ArticleDetail show'>
        <div className='detailInfo'>
          <div className='left'>
            <div className='info'>
              <i className='fa fa-fw fa-square'/> {folderName}&nbsp;
              by {article.User.profileName}&nbsp;
              Created {moment(article.createdAt).format('YYYY/MM/DD')}&nbsp;
              Updated {moment(article.updatedAt).format('YYYY/MM/DD')}
            </div>
            <div className='tags'><i className='fa fa-fw fa-tags'/>{tags}</div>
          </div>

          <div className='right'>
            <button onClick={this.props.switchDetailMode('edit')}><i className='fa fa-fw fa-edit'/></button>
            <button><i className='fa fa-fw fa-trash'/></button>
            <button><i className='fa fa-fw fa-share-alt'/></button>
          </div>
        </div>
        <div className='detailBody'>
          <div className='detailPanel'>
            <div className='header'>
              <ModeIcon className='mode' mode={article.mode}/>
              <div className='title'>{article.title}</div>
            </div>
            {article.mode === 'markdown' ? <MarkdownPreview content={article.CurrentRevision.content}/> : <CodeEditor readOnly={true} onChange={this.handleContentChange} mode={article.mode} code={article.CurrentRevision.content}/>}
          </div>
        </div>
      </div>
    )
  }
})
