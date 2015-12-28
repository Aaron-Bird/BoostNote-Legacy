import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ModeIcon from 'browser/components/ModeIcon'
import moment from 'moment'
import { switchArticle } from '../actions'
import FolderMark from 'browser/components/FolderMark'
import TagLink from './TagLink'
import _ from 'lodash'

export default class ArticleList extends React.Component {
  componentDidMount () {
    this.refreshTimer = setInterval(() => this.forceUpdate(), 60 * 1000)
  }

  componentWillUnmount () {
    clearInterval(this.refreshTimer)
  }

  componentDidUpdate () {
    let { articles, activeArticle } = this.props
    var index = articles.indexOf(activeArticle)
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

  render () {
    let { articles, modified, activeArticle, folders } = this.props

    let articleElements = articles.map(article => {
      let modifiedArticle = _.findWhere(modified, {key: article.key})
      let originalArticle = article
      if (modifiedArticle) {
        article = Object.assign({}, article, modifiedArticle)
      }
      let tagElements = Array.isArray(article.tags) && article.tags.length > 0
        ? article.tags.map(tag => {
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
          <div onClick={e => this.handleArticleClick(article)(e)} className={'ArticleList-item' + (activeArticle.key === article.key ? ' active' : '')}>
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
              <span className='updatedAt'
                children={
                  modifiedArticle != null
                    ? <span><span className='unsaved-mark'>●</span> Unsaved</span>
                    : moment(article.updatedAt).fromNow()
                }
              />
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
      <div className='ArticleList'>
        {articleElements}
      </div>
    )
  }
}

ArticleList.propTypes = {
  folders: PropTypes.array,
  articles: PropTypes.array,
  modified: PropTypes.array,
  activeArticle: PropTypes.shape(),
  dispatch: PropTypes.func
}
