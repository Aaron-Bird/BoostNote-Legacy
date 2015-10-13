import React, { PropTypes } from 'react'
import moment from 'moment'
import { findWhere } from 'lodash'
import ModeIcon from '../../Components/ModeIcon'
import MarkdownPreview from '../../Components/MarkdownPreview'
import CodeEditor from '../../Components/CodeEditor'

export default class ArticleDetail extends React.Component {
  render () {
    let { article, status, user } = this.props

    let tags = article.Tags.length > 0 ? article.Tags.map(tag => {
      return (
        <a key={tag.id}>{tag.name}</a>
      )
    }) : (
      <span className='noTags'>Not tagged yet</span>
    )
    let folder = findWhere(user.Folders, {id: article.FolderId})
    let folderName = folder != null ? folder.name : '(unknown)'

    return (
      <div className='ArticleDetail show'>
        <div className='detailInfo'>
          <div className='left'>
            <div className='info'>
              <i className='fa fa-fw fa-square'/> {folderName}&nbsp;
              by {article.User.profileName}&nbsp;
              Created {moment(article.createdAt).format('YYYY/MM/DD')}&nbsp;
              Updated {moment(article.updatedAt).format('YYYY/MM/DD')}
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
              <ModeIcon className='mode' mode={article.mode}/>
              <div className='title'>{article.title}</div>
            </div>
            {article.mode === 'markdown' ? <MarkdownPreview content={article.content}/> : <CodeEditor readOnly={true} onChange={this.handleContentChange} mode={article.mode} code={article.content}/>}
          </div>
        </div>
      </div>
    )
  }
}

ArticleDetail.propTypes = {
  article: PropTypes.shape(),
  status: PropTypes.shape(),
  user: PropTypes.shape()
}
