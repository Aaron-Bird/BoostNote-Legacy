import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import _ from 'lodash'
import ModeIcon from 'boost/components/ModeIcon'
import MarkdownPreview from 'boost/components/MarkdownPreview'
import CodeEditor from 'boost/components/CodeEditor'
import { IDLE_MODE, CREATE_MODE, EDIT_MODE, switchMode, switchArticle, switchFolder, clearSearch, updateArticle, destroyArticle, NEW } from 'boost/actions'
import linkState from 'boost/linkState'
import FolderMark from 'boost/components/FolderMark'
import TagLink from 'boost/components/TagLink'
import TagSelect from 'boost/components/TagSelect'
import ModeSelect from 'boost/components/ModeSelect'
import activityRecord from 'boost/activityRecord'

function makeInstantArticle (article) {
  return Object.assign({}, article)
}

export default class ArticleDetail extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      article: makeInstantArticle(props.activeArticle),
      previewMode: false
    }
  }

  componentDidMount () {
    this.refreshTimer = setInterval(() => this.forceUpdate(), 60 * 1000)
  }

  componentWillUnmount () {
    clearInterval(this.refreshTimer)
  }

  componentDidUpdate (prevProps) {
    let isModeChanged = prevProps.status.mode !== this.props.status.mode
    if (isModeChanged && this.props.status.mode !== IDLE_MODE) {
      ReactDOM.findDOMNode(this.refs.title).focus()
    }
  }

  componentWillReceiveProps (nextProps) {
    let nextState = {}

    let isArticleChanged = nextProps.activeArticle != null && (nextProps.activeArticle.key !== this.state.article.key)
    let isModeChanged = nextProps.status.mode !== this.props.status.mode
    // Reset article input
    if (isArticleChanged || (isModeChanged && nextProps.status.mode !== IDLE_MODE)) {
      Object.assign(nextState, {
        article: makeInstantArticle(nextProps.activeArticle)
      })
    }

    // Clean state
    if (isModeChanged) {
      Object.assign(nextState, {
        openDeleteConfirmMenu: false,
        previewMode: false
      })
    }

    this.setState(nextState)
  }

  renderEmpty () {
    return (
      <div className='ArticleDetail empty'>
        Command(⌘) + Enter to create a new post
      </div>
    )
  }

  handleEditButtonClick (e) {
    let { dispatch } = this.props
    dispatch(switchMode(EDIT_MODE))
  }

  handleDeleteButtonClick (e) {
    this.setState({openDeleteConfirmMenu: true})
  }

  handleDeleteConfirmButtonClick (e) {
    let { dispatch, activeArticle } = this.props

    dispatch(destroyArticle(activeArticle.key))
    activityRecord.emit('ARTICLE_DESTROY')
    this.setState({openDeleteConfirmMenu: false})
  }

  handleDeleteCancelButtonClick (e) {
    this.setState({openDeleteConfirmMenu: false})
  }

  renderIdle () {
    let { activeArticle, folders } = this.props

    let tags = activeArticle.tags != null ? activeArticle.tags.length > 0
      ? activeArticle.tags.map(tag => {
        return (<TagLink key={tag} tag={tag}/>)
      })
      : (
        <span className='noTags'>Not tagged yet</span>
      ) : null
    let folder = _.findWhere(folders, {key: activeArticle.FolderKey})

    return (
      <div className='ArticleDetail idle'>
        {this.state.openDeleteConfirmMenu
          ? (
            <div className='deleteConfirm'>
              <div className='right'>
                Are you sure to delete this article?
                <button onClick={e => this.handleDeleteConfirmButtonClick(e)} className='primary'>
                  <i className='fa fa-fw fa-check'/> Sure
                </button>
                <button onClick={e => this.handleDeleteCancelButtonClick(e)}>
                  <i className='fa fa-fw fa-times'/> Cancel
                </button>
              </div>
            </div>
          )
          : (
            <div className='detailInfo'>
              <div className='left'>
                <div className='info'>
                  <FolderMark color={folder.color}/> <span className='folderName'>{folder.name}</span>&nbsp;
                  Created : {moment(activeArticle.createdAt).format('YYYY/MM/DD')}&nbsp;
                  Updated : {moment(activeArticle.updatedAt).format('YYYY/MM/DD')}
                </div>
                <div className='tags'><i className='fa fa-fw fa-tags'/>{tags}</div>
              </div>
              <div className='right'>
                <button onClick={e => this.handleEditButtonClick(e)} className='editBtn'>
                  <i className='fa fa-fw fa-edit'/><span className='tooltip'>Edit (e)</span>
                </button>
                <button onClick={e => this.handleDeleteButtonClick(e)} className='deleteBtn'>
                  <i className='fa fa-fw fa-trash'/><span className='tooltip'>Delete (d)</span>
                </button>
              </div>
            </div>
          )
        }

        <div className='detailBody'>
          <div className='detailPanel'>
            <div className='header'>
              <ModeIcon className='mode' mode={activeArticle.mode}/>
              <div className='title'>{activeArticle.title}</div>
            </div>
            {activeArticle.mode === 'markdown'
              ? <MarkdownPreview content={activeArticle.content}/>
              : <CodeEditor readOnly onChange={(e, value) => this.handleContentChange(e, value)} mode={activeArticle.mode} code={activeArticle.content}/>
            }
          </div>
        </div>
      </div>
    )
  }

  handleCancelButtonClick (e) {
    let { activeArticle, dispatch } = this.props
    if (activeArticle.status === NEW) dispatch(switchArticle(null))
    dispatch(switchMode(IDLE_MODE))
  }

  handleSaveButtonClick (e) {
    let { dispatch, folders, filters } = this.props
    let article = this.state.article
    let newArticle = Object.assign({}, article)

    let folder = _.findWhere(folders, {key: article.FolderKey})
    if (folder == null) return false

    delete newArticle.status
    newArticle.updatedAt = new Date()
    if (newArticle.createdAt == null) {
      newArticle.createdAt = new Date()
      activityRecord.emit('ARTICLE_CREATE')
    } else {
      activityRecord.emit('ARTICLE_UPDATE')
    }

    dispatch(updateArticle(newArticle))
    dispatch(switchMode(IDLE_MODE))
    // Folder filterがかかっている時に、
    // Searchを初期化し、更新先のFolder filterをかける
    // かかれていない時に
    // Searchを初期化する
    if (filters.folder.length !== 0) dispatch(switchFolder(folder.name))
    else dispatch(clearSearch())
    dispatch(switchArticle(newArticle.key))
  }

  handleFolderKeyChange (e) {
    let article = this.state.article
    article.FolderKey = e.target.value

    this.setState({article: article})
  }

  handleTagsChange (newTag, tags) {
    let article = this.state.article
    article.tags = tags

    this.setState({article: article})
  }

  handleModeChange (value) {
    let article = this.state.article
    article.mode = value
    this.setState({
      article: article,
      previewMode: false
    })
  }

  handleModeSelectBlur () {
    if (this.refs.code != null) {
      this.refs.code.editor.focus()
    }
  }

  handleContentChange (e, value) {
    let article = this.state.article
    article.content = value
    this.setState({article: article})
  }

  handleTogglePreviewButtonClick (e) {
    this.setState({previewMode: !this.state.previewMode})
  }

  handleTitleKeyDown (e) {
    console.log(e.keyCode)
    if (e.keyCode === 9) {
      e.preventDefault()
      this.refs.mode.handleIdleSelectClick()
    }
  }

  renderEdit () {
    let { folders } = this.props

    let folderOptions = folders.map(folder => {
      return (
        <option key={folder.key} value={folder.key}>{folder.name}</option>
      )
    })

    return (
      <div className='ArticleDetail edit'>
        <div className='detailInfo'>
          <div className='left'>
            <select
              className='folder'
              value={this.state.article.FolderKey}
              onChange={e => this.handleFolderKeyChange(e)}
            >
              {folderOptions}
            </select>

            <TagSelect
              tags={this.state.article.tags}
              onChange={(tags, tag) => this.handleTagsChange(tags, tag)}
            />
          </div>
          <div className='right'>
            {
              this.state.article.mode === 'markdown'
                ? (<button className='preview' onClick={e => this.handleTogglePreviewButtonClick(e)}>{!this.state.previewMode ? 'Preview' : 'Edit'}</button>)
                : null
            }
            <button onClick={e => this.handleCancelButtonClick(e)}>Cancel</button>
            <button onClick={e => this.handleSaveButtonClick(e)} className='primary'>Save</button>
          </div>
        </div>
        <div className='detailBody'>
          <div className='detailPanel'>
            <div className='header'>
              <div className='title'>
                <input onKeyDown={e => this.handleTitleKeyDown(e)} placeholder='Title' ref='title' valueLink={this.linkState('article.title')}/>
              </div>
              <ModeSelect
                ref='mode'
                onChange={e => this.handleModeChange(e)}
                value={this.state.article.mode}
                className='mode'
                onBlur={() => this.handleModeSelectBlur()}
              />
            </div>

            {this.state.previewMode
              ? <MarkdownPreview content={this.state.article.content}/>
              : (<CodeEditor
                  ref='code'
                  onChange={(e, value) => this.handleContentChange(e, value)}
                  readOnly={false}
                  mode={this.state.article.mode}
                  code={this.state.article.content}
                />)
            }
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
