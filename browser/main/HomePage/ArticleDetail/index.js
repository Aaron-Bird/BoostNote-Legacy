import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import _ from 'lodash'
import {
  switchFolder,
  cacheArticle,
  saveArticle,
  uncacheArticle
} from '../../actions'
import linkState from 'browser/lib/linkState'
import TagSelect from 'browser/components/TagSelect'
import ModeSelect from 'browser/components/ModeSelect'
import ShareButton from './ShareButton'
import { openModal, isModalOpen } from 'browser/lib/modal'
import DeleteArticleModal from '../../modal/DeleteArticleModal'
import ArticleEditor from './ArticleEditor'
const electron = require('electron')
const ipc = electron.ipcRenderer
const remote = electron.remote
const { Menu, MenuItem } = remote

const othersMenu = new Menu()
othersMenu.append(new MenuItem({
  label: 'Delete Post',
  click: function () {
    remote.getCurrentWebContents().send('detail-delete')
  }
}))
othersMenu.append(new MenuItem({
  label: 'Discard Change',
  click: function (item) {
    remote.getCurrentWebContents().send('detail-uncache')
  }
}))

const BRAND_COLOR = '#18AF90'
const OSX = global.process.platform === 'darwin'

const editDeleteTutorialElement = (
  <svg width='300' height='500' className='tutorial'>
    <text x='50' y='220' fill={BRAND_COLOR} fontSize='24'>Edit / Delete a post</text>
    <text x='90' y='245' fill={BRAND_COLOR} fontSize='18'>press `e`/`d`</text>

    <svg x='150' y='35'>
      <path fill='white' d='M87.5,93.6c-16.3-5.7-30.6-16.7-39.9-31.4c-5.5-8.7-9-19.1-3.4-28.7c4.8-8.2,13.6-12.8,22.4-15.3
        c15.7-4.5,34.4-6.2,49.7,0.4c17.3,7.4,25.6,26.3,25.7,44.4c0.1,10.4-3.4,20.9-13.1,26c-8.6,4.5-19,4.1-28.4,3.7
        c-1.9-0.1-1.9,2.9,0,3c9.3,0.4,19.2,0.6,27.9-3.2c8.5-3.7,13.8-11.2,15.7-20.2c3.6-17.9-2.9-40.2-17.7-51.4
        C110.8,9.1,89,9.9,70.8,14c-17.9,4-37.4,16.8-31.3,37.9C45.6,73,66.7,89.5,86.7,96.5C88.6,97.1,89.4,94.2,87.5,93.6L87.5,93.6z'/>
      <path fill='white' d='M11.9,89.7c14.8-3.4,29.7-6,44.8-7.9c-0.5-0.6-1-1.3-1.4-1.9c-2.6,6.3-2.8,12.7-0.7,19.2
        c0.6,1.8,3.5,1,2.9-0.8c-1.9-6-1.7-11.8,0.7-17.6c0.3-0.8-0.5-2-1.4-1.9c-15.3,1.9-30.6,4.5-45.6,8C9.3,87.3,10.1,90.2,11.9,89.7
        L11.9,89.7z'/>
      <path fill='white' d='M48.6,81.5c-9.4,10.4-17,22.3-22.2,35.3c-5.5,13.6-9.3,28.9-6,43.4c0.4,1.9,3.3,1.1,2.9-0.8
        c-3.2-14,0.7-28.8,6-41.8c5.1-12.5,12.4-24,21.5-34C52,82.2,49.9,80,48.6,81.5L48.6,81.5z'/>
    </svg>
  </svg>
)

const tagSelectTutorialElement = (
  <svg width='500' height='500' className='tutorial'>
    <text x='155' y='50' fill={BRAND_COLOR} fontSize='24'>Attach some tags here!</text>

    <svg x='0' y='-15'>
      <path fill='white' d='M15.5,22.2c77.8-0.7,155.6-1.3,233.5-2c22.2-0.2,44.4-0.4,66.6-0.6c1.9,0,1.9-3,0-3
        c-77.8,0.7-155.6,1.3-233.5,2c-22.2,0.2-44.4,0.4-66.6,0.6C13.6,19.2,13.6,22.2,15.5,22.2L15.5,22.2z'/>
      <path fill='white' d='M130.8,25c-5.4,6.8-10.3,14-14.6,21.5c-0.8,1.4,1.2,3.2,2.4,1.8c1-1.2,2-2.4,3.1-3.7c1.2-1.5-0.9-3.6-2.1-2.1
        c-1,1.2-2,2.4-3.1,3.7c0.8,0.6,1.6,1.2,2.4,1.8c4.2-7.3,8.9-14.3,14.2-20.9C134.1,25.6,132,23.4,130.8,25L130.8,25z'/>
      <path fill='white' d='M132.6,22.1c8.4,5.9,16.8,11.9,25.2,17.8c1.6,1.1,3.1-1.5,1.5-2.6c-8.4-5.9-16.8-11.9-25.2-17.8
        C132.5,18.4,131,21,132.6,22.1L132.6,22.1z'/>
      <path fill='white' d='M132.9,18.6c0.4,6.7-0.7,13.3-3.5,19.3c-1.5,3.1-3.9,6.4-3.1,10c0.7,3.1,3.4,4.4,6.2,5.5
        c5.1,2.1,10.5,3.1,16.1,3.2c1.9,0,1.9-3,0-3c-4.7-0.1-9.2-0.8-13.6-2.4c-3-1.1-6.2-1.9-5.4-6.6c0.4-2,2-4.1,2.8-5.9
        c2.9-6.3,4-13.1,3.6-20.1C135.8,16.7,132.8,16.7,132.9,18.6L132.9,18.6z'/>
    </svg>
  </svg>
)

const modeSelectTutorialElement = (
  <svg width='500' height='500' className='tutorial'>
    <text x='195' y='130' fill={BRAND_COLOR} fontSize='24'>Select code syntax!!</text>

    <svg x='300' y='0'>
      <path fill='white' d='M99.9,58.8c-14.5-0.5-29-2.2-43.1-5.6c-12.3-2.9-27.9-6.4-37.1-15.5C7.9,26,28.2,18.9,37,16.7
        c13.8-3.5,28.3-4.7,42.4-5.8c29.6-2.2,59.3-1.7,89-1c3,0.1,7.5-0.6,10.2,0.6c3.1,1.4,3.1,5.3,3.3,8.1c0.3,5.2-0.2,10.7-2.4,15.4
        c-4.4,9.6-18.4,14.7-27.5,18.1c-27.1,10.1-56.7,12.8-85.3,15.6c-1.9,0.2-1.9,3.2,0,3c29.3-2.9,59.8-5.6,87.5-16.2
        c9.6-3.7,22.8-8.7,27.7-18.4c2.3-4.6,3.2-9.9,3.2-15c0-3.6,0-9.4-2.9-12c-1.9-1.7-4.7-1.8-7.1-2c-4.8-0.2-9.6-0.2-14.4-0.3
        c-8.7-0.2-17.5-0.3-26.2-0.4C116.7,6.3,99,6.5,81.3,7.8c-15.8,1.1-32.1,2.3-47.4,6.6c-7.7,2.2-22.1,6.9-20.9,17.4
        c0.6,5.4,5.6,9.4,9.9,12.1c6.7,4.3,14.4,6.9,22,9.2c17.8,5.4,36.4,8,54.9,8.6C101.8,61.8,101.8,58.8,99.9,58.8L99.9,58.8z'/>
      <path fill='white' d='M11.1,67.8c9.2-6.1,18.6-11.9,28.2-17.2c-0.7-0.3-1.5-0.6-2.2-0.9c0.9,5.3,0.7,10.3-0.5,15.5
        c-0.4,1.9,2.4,2.7,2.9,0.8c1.4-5.7,1.5-11.3,0.5-17.1c-0.2-1-1.4-1.3-2.2-0.9c-9.7,5.3-19.1,11.1-28.2,17.2
        C8,66.3,9.5,68.9,11.1,67.8L11.1,67.8z'/>
      <path fill='white' d='M31.5,52.8C23.4,68.9,0.2,83.2,7.9,104c0.7,1.8,3.6,1,2.9-0.8C3.6,83.7,26.4,69.7,34.1,54.3
        C35,52.6,32.4,51.1,31.5,52.8L31.5,52.8z'/>
    </svg>
  </svg>
)

export default class ArticleDetail extends React.Component {
  constructor (props) {
    super(props)

    this.saveHandler = e => {
      if (isModalOpen()) return true
      this.handleSaveButtonClick()
    }
    this.deleteHandler = e => {
      if (isModalOpen()) return true
      this.handleDeleteButtonClick()
    }
    this.uncacheHandler = e => {
      if (isModalOpen()) return true
      this.handleUncache()
    }
    this.togglePreviewHandler = e => {
      if (isModalOpen()) return true
      this.handleTogglePreviewButtonClick()
    }
    this.editHandler = e => {
      if (isModalOpen()) return true
      this.editArticle()
    }

    this.state = {
      article: Object.assign({content: ''}, props.activeArticle),
      previewMode: true,
      openShareDropdown: false
    }

    if (props.activeArticle != null && props.activeArticle.content.trim().length > 0 && props.activeArticle.mode === 'markdown') this.state.previewMode = true
  }

  componentDidMount () {
    this.refreshTimer = setInterval(() => this.forceUpdate(), 60 * 1000)
    this.shareDropdownInterceptor = e => {
      e.stopPropagation()
    }

    ipc.on('detail-save', this.saveHandler)
    ipc.on('detail-delete', this.deleteHandler)
    ipc.on('detail-uncache', this.uncacheHandler)
    ipc.on('detail-toggle-preview', this.togglePreviewHandler)
    ipc.on('detail-edit', this.editHandler)
  }

  componentWillUnmount () {
    clearInterval(this.refreshTimer)

    ipc.removeListener('detail-save', this.saveHandler)
    ipc.removeListener('detail-delete', this.deleteHandler)
    ipc.removeListener('detail-uncache', this.uncacheHandler)
    ipc.removeListener('detail-toggle-preview', this.togglePreviewHandler)
    ipc.removeListener('detail-on', this.editHandler)
  }

  componentWillReceiveProps (nextProps) {
    let nextArticle = nextProps.activeArticle
    let nextModified = nextArticle != null ? _.findWhere(nextProps.modified, {key: nextArticle.key}) : null

    let article = Object.assign({content: ''}, nextProps.activeArticle, nextModified)
    let nextState = {
      article
    }

    this.setState(nextState)
  }

  editArticle () {
    ReactDOM.findDOMNode(this.refs.title).focus()
    ReactDOM.findDOMNode(this.refs.title).select()
  }

  cacheArticle () {
    let { dispatch } = this.props

    dispatch(cacheArticle(this.props.activeArticle.key, this.state.article))
  }

  renderEmpty () {
    return (
      <div className='ArticleDetail empty'>
        <div className='ArticleDetail-empty-box'>
          <div className='ArticleDetail-empty-box-message'>Command(⌘) + N<br/>to create a new post</div>
        </div>
      </div>
    )
  }

  handleSaveButtonClick (e) {
    let { dispatch, folders, status } = this.props

    let targetFolderKey = this.state.article.FolderKey
    dispatch(saveArticle(this.props.activeArticle.key, this.state.article), true)
    if (status.targetFolders.length > 0) {
      let targetFolder = _.findWhere(folders, {key: targetFolderKey})
      dispatch(switchFolder(targetFolder.name))
    }
  }

  handleOthersButtonClick (e) {
    let size = remote.getCurrentWindow().getSize()
    othersMenu.popup(size[0] - 150, 100)
  }

  handleFolderKeyChange (e) {
    let article = this.state.article
    article.FolderKey = e.target.value

    this.setState({article: article}, () => this.cacheArticle())
  }

  handleTitleChange (e) {
    let { article } = this.state
    article.title = e.target.value

    this.setState({
      article
    }, () => this.cacheArticle())
  }

  handleTagsChange (newTag, tags) {
    let article = this.state.article
    article.tags = tags

    this.setState({
      article
    }, () => this.cacheArticle())
  }

  handleModeChange (value) {
    let { article } = this.state
    article.mode = value
    this.setState({
      article
    }, () => this.cacheArticle())
  }

  handleContentChange (e, value) {
    let { article } = this.state
    article.content = value

    this.setState({
      article
    }, () => this.cacheArticle())
  }

  handleCodeEditorBlur (e) {
    if (this.state.article.mode === 'markdown' && !this.state.previewMode) {
      this.setState({
        previewMode: true
      })
    }
  }

  handleDeleteButtonClick (e) {
    if (this.props.activeArticle) {
      openModal(DeleteArticleModal, {articleKey: this.props.activeArticle.key})
    }
  }

  handleUncache (e) {
    if (this.props.activeArticle) {
      let { dispatch, activeArticle } = this.props
      dispatch(uncacheArticle(activeArticle.key))
    }
  }

  handleTitleKeyDown (e) {
    if (e.keyCode === 9 && !e.shiftKey) {
      e.preventDefault()
      this.refs.mode.handleIdleSelectClick()
    }
  }

  handleModeSelectKeyDown (e) {
    if (e.keyCode === 9 && !e.shiftKey) {
      e.preventDefault()
      this.refs.editor.switchEditMode()
    }
    if (e.keyCode === 9 && e.shiftKey) {
      e.preventDefault()
      ReactDOM.findDOMNode(this.refs.title).focus()
    }
  }

  render () {
    let { folders, status, tags, activeArticle, modified, user } = this.props
    if (activeArticle == null) return this.renderEmpty()
    let folderOptions = folders.map(folder => {
      return (
        <option key={folder.key} value={folder.key}>{folder.name}</option>
      )
    })

    let isUnsaved = !!_.findWhere(modified, {key: activeArticle.key})

    return (
      <div className='ArticleDetail'>
        <div className='ArticleDetail-info'>
          <div className='ArticleDetail-info-row'>
            <select
              className='ArticleDetail-info-folder'
              value={this.state.article.FolderKey}
              onChange={e => this.handleFolderKeyChange(e)}
            >
              {folderOptions}
            </select>
            <span className='ArticleDetail-info-status'
              children={
                isUnsaved
                  ? <span> <span className='unsaved-mark'>●</span> Unsaved</span>
                  : `Created : ${moment(this.state.article.createdAt).format('YYYY/MM/DD')} Updated : ${moment(this.state.article.updatedAt).format('YYYY/MM/DD')}`
              }
            />

            <div className='ArticleDetail-info-control'>
              <div className={'ArticleDetail-info-control-save' + (!isUnsaved ? ' hide' : '')}>
                <button
                  onClick={e => this.handleSaveButtonClick(e)}
                  className='ArticleDetail-info-control-save-button'
                  disabled={!isUnsaved}
                  >
                  <i className='fa fa-fw fa-save'/>&nbsp;Save
                  <span className='tooltip' children={`Save Post (${OSX ? '⌘' : '^'} + S)`}/>
                </button>
              </div>

              <ShareButton
                article={activeArticle}
                user={user}
                />

              <button onClick={e => this.handleOthersButtonClick(e)}>
                <i className='fa fa-fw fa-angle-down'/>
              </button>
            </div>
          </div>
          {status.isTutorialOpen ? editDeleteTutorialElement : null}
          <div>
            <TagSelect
              tags={this.state.article.tags}
              onChange={(tags, tag) => this.handleTagsChange(tags, tag)}
              suggestTags={tags}
            />

            {status.isTutorialOpen ? tagSelectTutorialElement : null}
          </div>
        </div>

        <div className='ArticleDetail-panel'>
          <div className='ArticleDetail-panel-header'>
            <div className='ArticleDetail-panel-header-title'>
              <input
                onKeyDown={e => this.handleTitleKeyDown(e)}
                placeholder='(Untitled)'
                ref='title'
                value={this.state.article.title}
                onChange={e => this.handleTitleChange(e)}
              />
            </div>
            <ModeSelect
              ref='mode'
              onChange={e => this.handleModeChange(e)}
              onKeyDown={e => this.handleModeSelectKeyDown(e)}
              value={this.state.article.mode}
              className='ArticleDetail-panel-header-mode'
            />
          </div>
          {status.isTutorialOpen ? modeSelectTutorialElement : null}
          <ArticleEditor
            ref='editor'
            content={this.state.article.content}
            mode={this.state.article.mode}
            onChange={(e, content) => this.handleContentChange(e, content)}
          />
        </div>
      </div>
    )
  }
}

ArticleDetail.propTypes = {
  dispatch: PropTypes.func,
  status: PropTypes.shape(),
  tags: PropTypes.array,
  user: PropTypes.shape(),
  folders: PropTypes.array,
  modified: PropTypes.array,
  activeArticle: PropTypes.shape()
}
ArticleDetail.prototype.linkState = linkState
