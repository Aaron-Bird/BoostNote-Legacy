var React = require('react/addons')
var ReactRouter = require('react-router')
var moment = require('moment')

var ForceUpdate = require('../Mixins/ForceUpdate')
var Markdown = require('../Mixins/Markdown')

var PlanetArticleList = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State, ForceUpdate(60000), Markdown],
  propTypes: {
    articles: React.PropTypes.array,
    showOnlyWithTag: React.PropTypes.func
  },
  handleKeyDown: function (e) {
    e.preventDefault()
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
      var isActive = article.type === 'snippet' ? this.isActive('snippets') && parseInt(params.localId, 10) === article.localId : this.isActive('blueprints') && parseInt(params.localId, 10) === article.localId

      var handleClick

      if (article.type === 'snippet') {

        handleClick = function () {
          this.transitionTo('snippets', {
            userName: params.userName,
            planetName: params.planetName,
            localId: article.localId
          })
        }.bind(this)

        return (
          <li onClick={handleClick} key={'snippet-' + article.id}>
            <div className={'articleItem snippetItem' + (isActive ? ' active' : '')}>
              <div className='itemHeader'>
                <div className='callSign'><i className='fa fa-code fa-fw'></i> {article.callSign}</div>
                <div className='updatedAt'>{moment(article.updatedAt).fromNow()}</div>
              </div>
              <div className='description'>{article.description.length > 50 ? article.description.substring(0, 50) + ' …' : article.description}</div>
              <div className='tags'><i className='fa fa-tags'/>{tags}</div>
            </div>
            <div className='divider'></div>
          </li>
        )
      }

      handleClick = function () {
        this.transitionTo('blueprints', {
          userName: params.userName,
          planetName: params.planetName,
          localId: article.localId
        })
      }.bind(this)

      return (
        <li onClick={handleClick} key={'blueprint-' + article.id}>
          <div className={'articleItem blueprintItem' + (isActive ? ' active' : '')}>
            <div className='itemHeader'>
              <div className='callSign'><i className='fa fa-file-text-o fa-fw'></i> {article.title}</div>
              <div className='updatedAt'>{moment(article.updatedAt).fromNow()}</div>
            </div>
            <div className='content'>{this.markdown(article.content.substring(0, 150)).replace(/(<([^>]+)>)/ig, '').substring(0, 75)}</div>
            <div className='tags'><i className='fa fa-tags'/>{tags}</div>
          </div>
          <div className='divider'></div>
        </li>
      )

    }.bind(this))

    return (
      <div className='PlanetArticleList'>
        <ul onKeyDown={this.handleKeyDown} tabIndex='2'>
          {articles}
        </ul>
      </div>
    )
  }
})

module.exports = PlanetArticleList
