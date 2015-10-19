import React, { PropTypes } from 'react'
import ProfileImage from 'boost/components/ProfileImage'
import ModeIcon from 'boost/components/ModeIcon'
import moment from 'moment'
import { switchArticle, NEW } from 'boost/actions'
import FolderMark from 'boost/components/FolderMark'

export default class ArticleList extends React.Component {
  handleArticleClick (key) {
    let { dispatch } = this.props
    return function (e) {
      dispatch(switchArticle(key))
    }
  }

  render () {
    let { articles, activeArticle } = this.props
    console.log(articles)

    let articlesEl = articles.map(article => {
      let tags = Array.isArray(article.Tags) && article.Tags.length > 0
        ? article.Tags.map(tag => {
          return (<a key={tag.name}>{tag.name}</a>)
        })
        : (<span>Not tagged yet</span>)

      return (
        <div key={'article-' + article.key}>
          <div onClick={e => this.handleArticleClick(article.key)(e)} className={'articleItem' + (activeArticle.key === article.key ? ' active' : '')}>
            <div className='top'>
              <FolderMark id={article.FolderId}/>
              by <ProfileImage className='profileImage' size='20' email={article.User.email}/> {article.User.profileName}
            <span className='updatedAt'>{article.status != null ? article.status : moment(article.updatedAt).fromNow()}</span>
            </div>
            <div className='middle'>
              <ModeIcon className='mode' mode={article.mode}/> <div className='title'>{article.status !== NEW ? article.title : '(New article)'}</div>
            </div>
            <div className='bottom'>
              <div className='tags'><i className='fa fa-fw fa-tags'/>{tags}</div>
            </div>
          </div>
          <div className='divider'></div>
        </div>
      )
    })

    return (
      <div className='ArticleList'>
        {articlesEl}
      </div>
    )
  }
}

ArticleList.propTypes = {
  articles: PropTypes.array,
  activeArticle: PropTypes.shape(),
  dispatch: PropTypes.func
}
