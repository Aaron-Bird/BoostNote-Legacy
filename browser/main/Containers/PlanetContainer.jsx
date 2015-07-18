var React = require('react/addons')
var ReactRouter = require('react-router')

var PlanetHeader = require('../Components/PlanetHeader')
var PlanetNavigator = require('../Components/PlanetNavigator')
var PlanetArticleList = require('../Components/PlanetArticleList')
var PlanetArticleDetail = require('../Components/PlanetArticleDetail')

var PlanetActions = require('../Actions/PlanetActions')

var AuthStore = require('../Stores/AuthStore')
var PlanetStore = require('../Stores/PlanetStore')

module.exports = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State],
  propTypes: {
    params: React.PropTypes.object,
    planetName: React.PropTypes.string
  },
  getInitialState: function () {
    return {
      currentPlanet: null,
      filteredArticles: []
    }
  },
  componentDidMount: function () {
    this.unsubscribe = PlanetStore.listen(this.onFetched)

    PlanetActions.fetchPlanet(this.props.params.userName + '/' + this.props.params.planetName)
  },
  componentWillUnmount: function () {
    this.unsubscribe()
  },
  getIndexOfCurrentArticle: function () {
    var params = this.props.params
    var index = 0

    if (this.isActive('snippets')) {
      this.state.filteredArticles.some(function (_article, _index) {
        if (_article.type === 'snippet' && _article.localId === parseInt(params.localId, 10)) {
          index = _index
        }
      })
    } else if (this.isActive('blueprints')) {
      this.state.filteredArticles.some(function (_article, _index) {
        if (_article.type === 'blueprint' && _article.localId === parseInt(params.localId, 10)) {
          index = _index
          return true
        }
        return false
      })
    }

    return index
  },
  selectArticleByIndex: function (index) {
    var article = this.state.filteredArticles[index]
    var params = this.props.params

    if (article == null) {
      this.transitionTo('planetHome', params)
    }

    if (article.type === 'snippet') {
      params.localId = article.localId
      this.transitionTo('snippets', params)
      return
    }

    if (article.type === 'blueprint') {
      params.localId = article.localId
      this.transitionTo('blueprints', params)
      return
    }
  },
  selectNextArticle: function () {
    if (this.state.currentPlanet == null || this.state.filteredArticles.length === 0) return

    var index = this.getIndexOfCurrentArticle()

    if (index < this.state.filteredArticles.length - 1) {
      this.selectArticleByIndex(index + 1)
    }
  },
  selectPriorArticle: function () {
    if (this.state.currentPlanet == null || this.state.filteredArticles.length === 0) return

    var index = this.getIndexOfCurrentArticle()

    if (index > 0) {
      this.selectArticleByIndex(index - 1)
    }
  },
  onFetched: function (res) {
    var articles = this.state.currentPlanet == null ? null : this.state.currentPlanet.Articles

    if (res.status === 'planetFetched') {
      var planet = res.data
      this.setState({currentPlanet: planet, filteredArticles: planet.Articles}, function () {
        if (planet.Articles.length > 0) {
          if (this.isActive('snippets')) {
            this.transitionTo('snippets', {
              userName: this.props.params.userName,
              planetName: this.props.params.planetName,
              localId: this.props.params.localId == null ? planet.Articles[0].localId : this.props.params.localId
            })
          } else if (this.isActive('blueprints')) {
            this.transitionTo('blueprints', {
              userName: this.props.params.userName,
              planetName: this.props.params.planetName,
              localId: this.props.params.localId == null ? planet.Articles[0].localId : this.props.params.localId
            })
          }
        }
      })
      return
    }

    var article = res.data
    var index = this.getIndexOfCurrentArticle()

    if (article.PlanetId === this.state.currentPlanet.id) {
      switch (res.status) {
        case 'articleCreated':
          articles.unshift(article)

          this.setState({planet: this.state.currentPlanet}, function () {
            this.selectArticleByIndex(0)
          })
          break
        case 'articleUpdated':
          articles.splice(index, 1)
          articles.unshift(article)

          this.setState({planet: this.state.currentPlanet})
          break
        case 'articleDeleted':
          articles.splice(index, 1)

          this.setState({planet: this.state.currentPlanet}, function () {
            if (index > 0) {
              this.selectArticleByIndex(index - 1)
            } else {
              this.selectArticleByIndex(index)
            }
          })
      }
    }
  },
  handleSearchChange: function (search) {
    var firstFiltered = this.state.currentPlanet.Articles.filter(function (article) {
      if (search === '' || search == null) return true

      var first = article.type === 'snippet' ? article.callSign : article.title
      if (first.match(new RegExp(search, 'i'))) return true

      return false
    })

    var secondFiltered = this.state.currentPlanet.Articles.filter(function (article) {
      var second = article.type === 'snippet' ? article.description : article.content
      if (second.match(new RegExp(search, 'i'))) return true

      return false
    })

    var thirdFiltered = this.state.currentPlanet.Articles.filter(function (article) {
      if (article.type === 'snippet') {
        if (article.content.match(new RegExp(search, 'i'))) return true
      }
      return false
    })

    var filteredArticles = firstFiltered.concat(secondFiltered, thirdFiltered).filter(function (value, index, self) {
      return self.indexOf(value) === index
    })
    this.setState({filteredArticles: filteredArticles}, function () {
      this.selectArticleByIndex(0)
    })
  },
  render: function () {
    var user = AuthStore.getUser()
    if (user == null) return (<div/>)
    if (this.state.currentPlanet == null) return (<div/>)

    var content = (<div>Nothing selected</div>)
    var localId = parseInt(this.props.params.localId, 10)
    if (this.isActive('snippets')) {
      this.state.currentPlanet.Articles.some(function (article) {
        if (article.type === 'snippet' && localId === article.localId) {
          content = (
            <PlanetArticleDetail article={article}/>
          )
          return true
        }
        return false
      })
    } else if (this.isActive('blueprints')) {
      this.state.currentPlanet.Articles.some(function (article) {
        if (article.type === 'blueprint' && localId === article.localId) {
          content = (
            <PlanetArticleDetail article={article}/>
          )
          return true
        }
        return false
      })
    }

    return (
      <div className='PlanetContainer'>
        <PlanetHeader onSearchChange={this.handleSearchChange} currentPlanet={this.state.currentPlanet} currentUser={user}/>
        <PlanetNavigator currentPlanet={this.state.currentPlanet} currentUser={user}/>
        <PlanetArticleList onPressUp={this.selectPriorArticle} onPressDown={this.selectNextArticle} articles={this.state.filteredArticles}/>
        {content}
      </div>
    )
  }
})
