var React = require('react/addons')
var ReactRouter = require('react-router')
var moment = require('moment')

var ForceUpdate = require('../Mixins/ForceUpdate')
var Markdown = require('../Mixins/Markdown')

var ProfileImage = require('../Components/ProfileImage')

module.exports = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State, ForceUpdate(60000), Markdown],
  propTypes: {
    articles: React.PropTypes.array,
    showOnlyWithTag: React.PropTypes.func
  },
  render: function () {
    var articles = this.props.articles.map(function (article) {
      var tags = article.Tags.length > 0 ? article.Tags.map(function (tag) {
        return (
          <a onClick={this.props.showOnlyWithTag(tag.name)} key={tag.id}>#{tag.name}</a>
        )
      }.bind(this)) : (
        <a className='noTag'>Not tagged yet</a>
      )
      var params = this.getParams()
      var isActive = article.type === 'code' ? this.isActive('codes') && parseInt(params.localId, 10) === article.localId : this.isActive('notes') && parseInt(params.localId, 10) === article.localId

      var handleClick

      if (article.type === 'code') {

        handleClick = function () {
          this.transitionTo('codes', {
            userName: params.userName,
            planetName: params.planetName,
            localId: article.localId
          })
        }.bind(this)

        return (
          <li onClick={handleClick} key={'code-' + article.id}>
            <div className={'articleItem' + (isActive ? ' active' : '')}>
              <div className='itemLeft'>
                <ProfileImage className='profileImage' size='25' email={article.User.email}/>
                <i className='fa fa-code fa-fw'></i>
              </div>
              <div className='itemRight'>
                <div className='updatedAt'>{moment(article.updatedAt).fromNow()}</div>
                <div className='description'>{article.description.length > 50 ? article.description.substring(0, 50) + ' …' : article.description}</div>
                <div className='tags'><i className='fa fa-tags'/>{tags}</div>
              </div>
            </div>
            <div className='divider'></div>
          </li>
        )
      }

      handleClick = function () {
        this.transitionTo('notes', {
          userName: params.userName,
          planetName: params.planetName,
          localId: article.localId
        })
      }.bind(this)

      return (
        <li onClick={handleClick} key={'note-' + article.id}>
          <div className={'articleItem blueprintItem' + (isActive ? ' active' : '')}>
            <div className='itemLeft'>
              <ProfileImage className='profileImage' size='25' email={article.User.email}/>
              <i className='fa fa-file-text-o fa-fw'></i>
            </div>

            <div className='itemRight'>
              <div className='updatedAt'>{moment(article.updatedAt).fromNow()}</div>
              <div className='description'>{article.title}</div>
              <div className='tags'><i className='fa fa-tags'/>{tags}</div>
            </div>
          </div>
          <div className='divider'></div>
        </li>
      )

    }.bind(this))

    return (
      <div className='PlanetArticleList'>
        <ul>
          {articles}
        </ul>
      </div>
    )
  }
})
