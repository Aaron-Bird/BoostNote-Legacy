import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import _ from 'lodash'
import linkState from 'browser/lib/linkState'
import TagSelect from 'browser/components/TagSelect'
import ModeSelect from 'browser/components/ModeSelect'
import ShareButton from './ShareButton'
import { openModal, isModalOpen } from 'browser/lib/modal'
import DeleteArticleModal from '../modals/DeleteArticleModal'
import ArticleEditor from './ArticleEditor'
const electron = require('electron')
const ipc = electron.ipcRenderer
import fetchConfig from 'browser/lib/fetchConfig'

let config = fetchConfig()
ipc.on('config-apply', function (e, newConfig) {
  config = newConfig
})

const BRAND_COLOR = '#18AF90'
const OSX = global.process.platform === 'darwin'

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

    this.deleteHandler = (e) => {
      if (isModalOpen()) return true
      this.handleDeleteButtonClick()
    }
    this.uncacheHandler = (e) => {
      if (isModalOpen()) return true
      this.handleUncache()
    }
    this.titleHandler = (e) => {
      if (isModalOpen()) return true
      if (this.refs.title) {
        this.focusTitle()
      }
    }
    this.editHandler = (e) => {
      if (isModalOpen()) return true
      if (this.refs.editor) this.refs.editor.switchEditMode()
    }
    this.previewHandler = (e) => {
      if (isModalOpen()) return true
      if (this.refs.editor) this.refs.editor.switchPreviewMode()
    }
    this.configApplyHandler = (e, config) => this.handleConfigApply(e, config)

    this.state = {
      article: Object.assign({content: ''}, props.activeArticle),
      openShareDropdown: false,
      fontFamily: config['editor-font-family']
    }
  }

  componentDidMount () {
    this.refreshTimer = setInterval(() => this.forceUpdate(), 60 * 1000)
    this.shareDropdownInterceptor = (e) => {
      e.stopPropagation()
    }

    ipc.on('detail-delete', this.deleteHandler)
    ipc.on('detail-uncache', this.uncacheHandler)
    ipc.on('detail-title', this.titleHandler)
    ipc.on('detail-edit', this.editHandler)
    ipc.on('detail-preview', this.previewHandler)
    ipc.on('config-apply', this.configApplyHandler)
  }

  componentWillUnmount () {
    clearInterval(this.refreshTimer)

    ipc.removeListener('detail-delete', this.deleteHandler)
    ipc.removeListener('detail-uncache', this.uncacheHandler)
    ipc.removeListener('detail-title', this.titleHandler)
    ipc.removeListener('detail-edit', this.editHandler)
    ipc.removeListener('detail-preview', this.previewHandler)
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.activeArticle == null || prevProps.activeArticle == null || this.props.activeArticle.key !== prevProps.activeArticle.key) {
      if (this.refs.editor) this.refs.editor.resetCursorPosition()
    }

    if (prevProps.activeArticle == null && this.props.activeArticle) {

    }
  }

  handleConfigApply (e, config) {
    this.setState({
      fontFamily: config['editor-font-family']
    })
  }

  renderEmpty () {
    return (
      <div className='ArticleDetail empty'>
        <div className='ArticleDetail-empty-box'>
          <div className='ArticleDetail-empty-box-message'>{OSX ? 'Command(⌘)' : 'Ctrl(^)'} + N<br/>to create a new post</div>
        </div>
      </div>
    )
  }

  handleOthersButtonClick (e) {
    this.deleteHandler()
  }

  handleFolderKeyChange (e) {
    let { dispatch, activeArticle, status, folders } = this.props
    let article = Object.assign({}, activeArticle, {
      FolderKey: e.target.value,
      updatedAt: new Date()
    })

    // dispatch(updateArticle(article))

    let targetFolderKey = e.target.value
    if (status.targetFolders.length > 0) {
      let targetFolder = _.findWhere(folders, {key: targetFolderKey})
      // dispatch(switchFolder(targetFolder.name))
    }
  }

  handleTitleChange (e) {
    let { dispatch, activeArticle } = this.props
    let article = Object.assign({}, activeArticle, {
      title: e.target.value,
      updatedAt: new Date()
    })
    // dispatch(updateArticle(article))
  }

  handleTagsChange (newTag, tags) {
    let { dispatch, activeArticle } = this.props
    let article = Object.assign({}, activeArticle, {
      tags: tags,
      updatedAt: new Date()
    })

    // dispatch(updateArticle(article))
  }

  handleModeChange (value) {
    let { dispatch, activeArticle } = this.props
    let article = Object.assign({}, activeArticle, {
      mode: value,
      updatedAt: new Date()
    })

    // dispatch(updateArticle(article))
    this.switchEditMode()
  }

  handleContentChange (value) {
    let { dispatch, activeArticle } = this.props
    if (activeArticle.content !== value) {
      let article = Object.assign({}, activeArticle, {
        content: value,
        updatedAt: new Date()
      })

      // dispatch(updateArticle(article))
    }
  }

  handleDeleteButtonClick (e) {
    if (this.props.activeArticle) {
      openModal(DeleteArticleModal, {articleKey: this.props.activeArticle.key})
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
      this.switchEditMode()
    }

    if (e.keyCode === 9 && e.shiftKey) {
      e.preventDefault()
      this.focusTitle()
    }

    if (e.keyCode === 27) {
      this.focusTitle()
    }
  }

  switchEditMode () {
    this.refs.editor.switchEditMode()
  }

  focusTitle () {
    if (this.refs.title) {
      let titleEl = ReactDOM.findDOMNode(this.refs.title)
      titleEl.focus()
      titleEl.select()
    }
  }

  render () {
    let { folders, status, tags, activeArticle, modified, user } = this.props
    if (activeArticle == null) return this.renderEmpty()
    let folderOptions = folders.map((folder) => {
      return (
        <option key={folder.key} value={folder.key}>{folder.name}</option>
      )
    })

    let isUnsaved = !!_.findWhere(modified, {key: activeArticle.key})

    return (
      <div tabIndex='4' className='ArticleDetail'>
        <div className='ArticleDetail-info'>
          <div className='ArticleDetail-info-row'>
            <select
              className='ArticleDetail-info-folder'
              value={activeArticle.FolderKey}
              onChange={(e) => this.handleFolderKeyChange(e)}
            >
              {folderOptions}
            </select>
            <span className='ArticleDetail-info-status'
              children={
                isUnsaved
                  ? <span> <span className='unsaved-mark'>●</span> Unsaved</span>
                  : `Created : ${moment(activeArticle.createdAt).format('YYYY/MM/DD')} Updated : ${moment(activeArticle.updatedAt).format('YYYY/MM/DD')}`
              }
            />

            <div className='ArticleDetail-info-control'>
              <ShareButton
                article={activeArticle}
                user={user}
                />

              <button className='ArticleDetail-info-control-delete-button' onClick={(e) => this.handleOthersButtonClick(e)}>
                <i className='fa fa-fw fa-trash'/>
                <span className='tooltip'>Delete Post (^ + Del)</span>
              </button>
            </div>
          </div>
          <div className='ArticleDetail-info-row2'>
            <TagSelect
              tags={activeArticle.tags}
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
                onKeyDown={(e) => this.handleTitleKeyDown(e)}
                placeholder='(Untitled)'
                ref='title'
                value={activeArticle.title}
                onChange={(e) => this.handleTitleChange(e)}
                style={{
                  fontFamily: this.state.fontFamily
                }}
              />
            </div>
            <ModeSelect
              ref='mode'
              onChange={(e) => this.handleModeChange(e)}
              onKeyDown={(e) => this.handleModeSelectKeyDown(e)}
              value={activeArticle.mode}
              className='ArticleDetail-panel-header-mode'
            />
            {status.isTutorialOpen ? modeSelectTutorialElement : null}
          </div>
          <ArticleEditor
            ref='editor'
            article={activeArticle}
            onChange={(content) => this.handleContentChange(content)}
          />
        </div>
      </div>
    )
  }
}

ArticleDetail.propTypes = {
  dispatch: PropTypes.func,
  repositories: PropTypes.array
}
ArticleDetail.prototype.linkState = linkState
