import React, { PropTypes } from 'react'
import moment from 'moment'
import { findWhere, uniq } from 'lodash'
import ModeIcon from 'boost/components/ModeIcon'
import MarkdownPreview from 'boost/components/MarkdownPreview'
import CodeEditor from 'boost/components/CodeEditor'
import { NEW, IDLE_MODE, CREATE_MODE, EDIT_MODE, switchMode } from '../actions'
import aceModes from 'boost/ace-modes'
import Select from 'react-select'
import linkState from 'boost/linkState'

var modeOptions = aceModes.map(function (mode) {
  return {
    label: mode,
    value: mode
  }
})

export default class ArticleDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      article: Object.assign({}, props.activeArticle)
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({article: nextProps.activeArticle})
  }

  renderEmpty () {
    return (
      <div className='ArticleDetail'>
        Empty article
      </div>
    )
  }

  renderIdle () {
    let { status, activeArticle, activeUser } = this.props

    let tags = activeArticle.Tags.length > 0 ? activeArticle.Tags.map(tag => {
      return (
        <a key={tag.id}>{tag.name}</a>
      )
    }) : (
      <span className='noTags'>Not tagged yet</span>
    )
    let folder = findWhere(activeUser.Folders, {id: activeArticle.FolderId})
    let folderName = folder != null ? folder.name : '(unknown)'

    return (
      <div className='ArticleDetail show'>
        <div className='detailInfo'>
          <div className='left'>
            <div className='info'>
              <i className='fa fa-fw fa-square'/> {folderName}&nbsp;
              by {activeArticle.User.profileName}&nbsp;
              Created {moment(activeArticle.createdAt).format('YYYY/MM/DD')}&nbsp;
              Updated {moment(activeArticle.updatedAt).format('YYYY/MM/DD')}
            </div>
            <div className='tags'><i className='fa fa-fw fa-tags'/>{tags}</div>
          </div>

          <div className='right'>
            <button><i className='fa fa-fw fa-edit'/></button>
            <button><i className='fa fa-fw fa-trash'/></button>
            <button><i className='fa fa-fw fa-share-alt'/></button>
          </div>
        </div>
        <div className='detailBody'>
          <div className='detailPanel'>
            <div className='header'>
              <ModeIcon className='mode' mode={activeArticle.mode}/>
              <div className='title'>{activeArticle.title}</div>
            </div>
            {activeArticle.mode === 'markdown' ? <MarkdownPreview content={activeArticle.content}/> : <CodeEditor readOnly={true} onChange={this.handleContentChange} mode={activeArticle.mode} code={activeArticle.content}/>}
          </div>
        </div>
      </div>
    )
  }

  handleCancelButtonClick (e) {
    this.props.dispatch(switchMode(IDLE_MODE))
  }

  handleSaveButtonClick (e) {
    console.log(this.state.article)
  }

  handleFolderIdChange (value) {
    let article = this.state.article
    article.FolderId = value
    this.setState({article: article})
  }

  handleTagsChange (tag, tags) {
    tags = uniq(tags, function (tag) {
      return tag.value
    })

    var article = this.state.article
    article.Tags = tags.map(function (tag) {
      return tag.value
    })

    this.setState({article: article})
  }

  handleModeChange (value) {
    let article = this.state.article
    article.mode = value
    this.setState({article: article})
  }

  handleContentChange (e, value) {
    let article = this.state.article
    article.content = value
    this.setState({article: article})
  }

  renderEdit () {
    let { status, activeUser } = this.props

    let folderOptions = activeUser.Folders.map(folder => {
      return {
        label: folder.name,
        value: folder.id
      }
    })

    return (
      <div className='ArticleDetail edit'>
        <div className='detailInfo'>
          <div className='left'>
            <Select ref='folder' onChange={value => this.handleFolderIdChange(value)} clearable={false} placeholder='select folder...' options={folderOptions} value={this.state.article.FolderId} className='folder'/>
            <Select onChange={(tag, tags) => this.handleTagsChange(tag, tags)} clearable={false} multi={true} placeholder='add some tags...' allowCreate={true} value={this.state.article.Tags} className='tags'/>
          </div>
          <div className='right'>
            <button onClick={e => this.handleCancelButtonClick(e)}>Cancel</button>
            <button onClick={e => this.handleSaveButtonClick(e)} className='primary'>Save</button>
          </div>
        </div>
        <div className='detailBody'>
          <div className='detailPanel'>
            <div className='header'>
              <div className='title'>
                <input ref='title' valueLink={this.linkState('article.title')}/>
              </div>
              <Select ref='mode' onChange={value => this.handleModeChange(value)} clearable={false} options={modeOptions}placeholder='select mode...' value={this.state.article.mode} className='mode'/>
            </div>
            <CodeEditor onChange={(e, value) => this.handleContentChange(e, value)} mode={this.state.article.mode} code={this.state.article.content}/>
          </div>
        </div>
      </div>
    )
  }

  render () {
    let { status, activeArticle } = this.props

    if (activeArticle == null) return this.renderEmpty()

    switch (status.mode) {
      case CREATE_MODE:
      case EDIT_MODE:
        return this.renderEdit()
      case IDLE_MODE:
      default:
        return this.renderIdle()

    }
  }
}

ArticleDetail.propTypes = {
  status: PropTypes.shape(),
  activeArticle: PropTypes.shape(),
  activeUser: PropTypes.shape()
}
ArticleDetail.prototype.linkState = linkState
