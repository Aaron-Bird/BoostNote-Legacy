import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ModeIcon from 'browser/components/ModeIcon'
import moment from 'moment'
import FolderMark from 'browser/components/FolderMark'
import TagLink from './TagLink'
import _ from 'lodash'

const electron = require('electron')
const remote = electron.remote
const ipc = electron.ipcRenderer

export default class ArticleList extends React.Component {
  constructor (props) {
    super(props)

    this.focusHandler = (e) => this.focus()
  }

  componentDidMount () {
    this.refreshTimer = setInterval(() => this.forceUpdate(), 60 * 1000)
    ipc.on('list-focus', this.focusHandler)
    this.focus()
  }

  componentWillUnmount () {
    clearInterval(this.refreshTimer)
    ipc.removeListener('list-focus', this.focusHandler)
  }

  componentDidUpdate () {
    return false
    var index = articles.indexOf(null)
    var el = ReactDOM.findDOMNode(this)
    var li = el.querySelectorAll('.ArticleList>div')[index]

    if (li == null) {
      return
    }

    var overflowBelow = el.clientHeight + el.scrollTop < li.offsetTop + li.clientHeight
    if (overflowBelow) {
      el.scrollTop = li.offsetTop + li.clientHeight - el.clientHeight
    }
    var overflowAbove = el.scrollTop > li.offsetTop
    if (overflowAbove) {
      el.scrollTop = li.offsetTop
    }
  }

  focus () {
    ReactDOM.findDOMNode(this).focus()
  }

  // 移動ができなかったらfalseを返す:
  selectPriorArticle () {
    let { articles, activeArticle, dispatch } = this.props
    let targetIndex = articles.indexOf(activeArticle) - 1
    let targetArticle = articles[targetIndex]

    if (targetArticle != null) {
      dispatch(switchArticle(targetArticle.key))
      return true
    }
    return false
  }

  selectNextArticle () {
    let { articles, activeArticle, dispatch } = this.props
    let targetIndex = articles.indexOf(activeArticle) + 1
    let targetArticle = articles[targetIndex]

    if (targetArticle != null) {
      dispatch(switchArticle(targetArticle.key))
      return true
    }
    return false
  }

  handleArticleClick (article) {
    let { dispatch } = this.props
    return function (e) {
      dispatch(switchArticle(article.key))
    }
  }

  handleArticleListKeyDown (e) {
    if (e.metaKey || e.ctrlKey) return true

    if (e.keyCode === 65 && !e.shiftKey) {
      e.preventDefault()
      remote.getCurrentWebContents().send('top-new-post')
    }

    if (e.keyCode === 65 && e.shiftKey) {
      e.preventDefault()
      remote.getCurrentWebContents().send('nav-new-folder')
    }

    if (e.keyCode === 68) {
      e.preventDefault()
      remote.getCurrentWebContents().send('detail-delete')
    }

    if (e.keyCode === 84) {
      e.preventDefault()
      remote.getCurrentWebContents().send('detail-title')
    }

    if (e.keyCode === 69) {
      e.preventDefault()
      remote.getCurrentWebContents().send('detail-edit')
    }

    if (e.keyCode === 83) {
      e.preventDefault()
      remote.getCurrentWebContents().send('detail-save')
    }

    if (e.keyCode === 38) {
      e.preventDefault()
      this.selectPriorArticle()
    }

    if (e.keyCode === 40) {
      e.preventDefault()
      this.selectNextArticle()
    }
  }

  render () {
    let articles = []
    let folders = []
    let articleElements = articles.map((article) => {
      let originalArticle = article
      let tagElements = Array.isArray(article.tags) && article.tags.length > 0
        ? article.tags.slice().map((tag) => {
          return (<TagLink key={tag} tag={tag}/>)
        })
        : (<span>Not tagged yet</span>)
      let folder = _.findWhere(folders, {key: article.FolderKey})
      let folderChanged = originalArticle.FolderKey !== article.FolderKey
      let originalFolder = folderChanged ? _.findWhere(folders, {key: originalArticle.FolderKey}) : null

      let title = article.title.trim().length === 0
        ? <small>(Untitled)</small>
        : article.title

      return (
        <div key={'article-' + article.key}>
          <div onClick={(e) => this.handleArticleClick(article)(e)} className={'ArticleList-item' + (article.key === 'ACTIVE_POST_KEY' ? ' active' : '')}>
            <div className='ArticleList-item-top'>
              {folder != null
                ? folderChanged
                  ? <span className='folderName'>
                    <FolderMark color={originalFolder.color}/>{originalFolder.name}
                    ->
                    <FolderMark color={folder.color}/>{folder.name}
                  </span>
                  : <span className='folderName'>
                    <FolderMark color={folder.color}/>{folder.name}
                  </span>
                : <span><FolderMark color={-1}/>Unknown</span>
              }
              <span className='updatedAt'>{moment(article.updatedAt).fromNow()}</span>
            </div>
            <div className='ArticleList-item-middle'>
              <ModeIcon className='mode' mode={article.mode}/> <div className='title' children={title}/>
            </div>
            <div className='ArticleList-item-middle2'>
              <pre><code children={article.content.trim().length === 0 ? '(Empty content)' : article.content.substring(0, 50)}/></pre>
            </div>
            <div className='ArticleList-item-bottom'>
              <div className='tags'><i className='fa fa-fw fa-tags'/>{tagElements}</div>
            </div>
          </div>
          <div className='divider'></div>
        </div>
      )
    })

    return (
      <div tabIndex='3' onKeyDown={(e) => this.handleArticleListKeyDown(e)} className='ArticleList'>
        {articleElements}
      </div>
    )
  }
}

ArticleList.propTypes = {
  dispatch: PropTypes.func,
  repositories: PropTypes.array
}
