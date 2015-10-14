import React, { PropTypes } from 'react'
import ProfileImage from 'boost/components/ProfileImage'
import ModeIcon from 'boost/components/ModeIcon'
import moment from 'moment'
import { IDLE_MODE, CREATE_MODE, EDIT_MODE, NEW } from '../actions'

export default class ArticleList extends React.Component {
  render () {
    let { status, articles, activeArticle } = this.props

    let articlesEl = articles.map(article => {
      let tags = Array.isArray(article.Tags) && article.Tags.length > 0 ? article.Tags.map(tag => {
        return (
          <a key={tag.id}>#{tag.name}</a>
        )
      }) : (
        <span>Not tagged yet</span>
      )

      return (
        <div key={'article-' + article.id}>
          <div className={'articleItem' + (activeArticle.id === article.id ? ' active' : '')}>
            <div className='top'>
              <i className='fa fa-fw fa-square'/>
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
  status: PropTypes.shape(),
  articles: PropTypes.array,
  activeArticle: PropTypes.shape()
}
