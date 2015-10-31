import React, { PropTypes } from 'react'
import ModeIcon from 'boost/components/ModeIcon'
import moment from 'moment'
import { switchArticle, NEW } from 'boost/actions'
import FolderMark from 'boost/components/FolderMark'
import TagLink from 'boost/components/TagLink'
import _ from 'lodash'

export default class ArticleList extends React.Component {
  componentDidMount () {
    this.refreshTimer = setInterval(() => this.forceUpdate(), 60 * 1000)
  }

  componentWillUnmount () {
    clearInterval(this.refreshTimer)
  }

  selectPriorArticle () {
    let { articles, activeArticle, dispatch } = this.props
    let targetIndex = articles.indexOf(activeArticle) - 1
    let targetArticle = articles[targetIndex]

    if (targetArticle != null) {
      dispatch(switchArticle(targetArticle.key))
    }
  }

  selectNextArticle () {
    let { articles, activeArticle, dispatch } = this.props
    let targetIndex = articles.indexOf(activeArticle) + 1
    let targetArticle = articles[targetIndex]

    if (targetArticle != null) {
      dispatch(switchArticle(targetArticle.key))
    }
  }

  handleArticleClick (article) {
    let { dispatch } = this.props
    return function (e) {
      if (article.status === NEW) return null
      dispatch(switchArticle(article.key))
    }
  }

  render () {
    let { articles, activeArticle, folders } = this.props

    let articleElements = articles.map(article => {
      let tagElements = Array.isArray(article.tags) && article.tags.length > 0
        ? article.tags.map(tag => {
          return (<TagLink key={tag} tag={tag}/>)
        })
        : (<span>Not tagged yet</span>)
      let folder = _.findWhere(folders, {key: article.FolderKey})

      return (
        <div key={'article-' + article.key}>
          <div onClick={e => this.handleArticleClick(article)(e)} className={'articleItem' + (activeArticle.key === article.key ? ' active' : '')}>
            <div className='top'>
              {folder != null
                ? <span><FolderMark color={folder.color}/>{folder.name}</span>
                : <span><FolderMark color={-1}/>Unknown</span>
              }
            <span className='updatedAt'>{article.status != null ? article.status : moment(article.updatedAt).fromNow()}</span>
            </div>
            <div className='middle'>
              <ModeIcon className='mode' mode={article.mode}/> <div className='title'>{article.status !== NEW ? article.title : '(New article)'}</div>
            </div>
            <div className='bottom'>
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
  activeArticle: PropTypes.shape(),
  dispatch: PropTypes.func
}
