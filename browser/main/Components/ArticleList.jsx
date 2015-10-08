var React = require('react')
var ReactRouter = require('react-router')
var moment = require('moment')
var _ = require('lodash')

var ForceUpdate = require('../Mixins/ForceUpdate')
var Markdown = require('../Mixins/Markdown')

var ProfileImage = require('../Components/ProfileImage')
var ModeIcon = require('../Components/ModeIcon')

module.exports = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State, ForceUpdate(60000), Markdown],
  propTypes: {
    articles: React.PropTypes.array
  },
  handleArticleClick: function (article) {
    return function () {
      this.props.selectArticle(article.id)
    }.bind(this)
  },
  render: function () {
    var articles = this.props.articles.map(function (article) {
      if (article == null) return null
      var tags = _.isArray(article.Tags) && article.Tags.length > 0 ? article.Tags.map(function (tag) {
        return (
          <a key={tag.id}>#{tag.name}</a>
        )
      }.bind(this)) : (
        <span>Not tagged yet</span>
      )
      var params = this.getParams()
      var isActive = this.props.currentArticle.id === article.id

      return (
        <li key={'article-' + article.id}>
          <div onClick={this.handleArticleClick(article)} className={'articleItem' + (isActive ? ' active' : '')}>
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
        </li>
      )
    }.bind(this))

    return (
      <div className='ArticleList'>
        <ul ref='articles'>
          {articles}
        </ul>
      </div>
    )
  }
})
