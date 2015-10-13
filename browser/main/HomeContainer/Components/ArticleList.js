import React, { PropTypes } from 'react'
import ProfileImage from '../../components/ProfileImage'
import ModeIcon from '../../Components/ModeIcon'
import moment from 'moment'
import { IDLE_MODE, CREATE_MODE, EDIT_MODE } from '../actions'

export default class ArticleList extends React.Component {
  render () {
    let { articles, status } = this.props

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
          <div className={'articleItem' + (false ? ' active' : '')}>
            <div className='top'>
              <i className='fa fa-fw fa-square'/>
              by <ProfileImage className='profileImage' size='20' email={article.User.email}/> {article.User.profileName}
            <span className='updatedAt'>{article.status != null ? article.status : moment(article.updatedAt).fromNow()}</span>
            </div>
            <div className='middle'>
              <ModeIcon className='mode' mode={article.mode}/> <div className='title'>{article.status !== 'new' ? article.title : '(New article)'}</div>
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
        { status.mode === 'CREATE_MODE' ? (
          <div key={'article-' + article.id}>
            <div className={'articleItem'}>
              <div className='top'>
              <span className='updatedAt'>{}</span>
              </div>
              <div className='middle'>
                <ModeIcon className='mode' mode={article.mode}/> <div className='title'>'(New article)'</div>
              </div>
              <div className='bottom'>
                <div className='tags'><i className='fa fa-fw fa-tags'/></div>
              </div>
            </div>
            <div className='divider'></div>
          </div>
        ) : null}
        {articlesEl}
      </div>
    )
  }
}

ArticleList.propTypes = {
  articles: PropTypes.array
}
