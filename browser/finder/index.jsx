/* global localStorage */
var remote = require('remote')
var hideFinder = remote.getGlobal('hideFinder')
var clipboard = require('clipboard')

var React = require('react')

var ArticleFilter = require('../main/Mixins/ArticleFilter')

var FinderInput = require('./Components/FinderInput')
var FinderList = require('./Components/FinderList')
var FinderDetail = require('./Components/FinderDetail')

// Filter end

function fetchArticles () {
  var user = JSON.parse(localStorage.getItem('currentUser'))
  if (user == null) {
    console.log('need to login')
    return []
  }

  var articles = []
  user.Planets.forEach(function (planet) {
    var _planet = JSON.parse(localStorage.getItem('planet-' + planet.id))
    articles = articles.concat(_planet.Codes, _planet.Notes)
  })
  user.Teams.forEach(function (team) {
    team.Planets.forEach(function (planet) {
      var _planet = JSON.parse(localStorage.getItem('planet-' + planet.id))
      articles = articles.concat(_planet.Codes, _planet.Notes)
    })
  })

  return articles
}

var Finder = React.createClass({
  mixins: [ArticleFilter],
  getInitialState: function () {
    var articles = fetchArticles()
    return {
      articles: articles,
      currentArticle: articles[0],
      search: ''
    }
  },
  componentDidMount: function () {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('click', this.handleClick)
    window.addEventListener('focus', this.handleFinderFocus)
    this.handleFinderFocus()
  },
  componentWillUnmount: function () {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('click', this.handleClick)
    window.removeEventListener('focus', this.handleFinderFocus)
  },
  handleFinderFocus: function () {
    console.log('focusseeddddd')
    this.focusInput()
    var articles = fetchArticles()
    this.setState({
      articles: articles,
      search: ''
    }, function () {
      var firstArticle = this.refs.finderList.props.articles[0]
      if (firstArticle) {
        this.setState({
          currentArticle: firstArticle
        })
      }
    })
  },
  handleKeyDown: function (e) {
    if (e.keyCode === 38) {
      this.selectPrevious()
      e.preventDefault()
    }

    if (e.keyCode === 40) {
      this.selectNext()
      e.preventDefault()
    }

    if (e.keyCode === 13) {
      var article = this.state.currentArticle
      clipboard.writeText(article.content)
      hideFinder()
      e.preventDefault()
    }
    if (e.keyCode === 27) {
      hideFinder()
      e.preventDefault()
    }
  },
  focusInput: function () {
    React.findDOMNode(this.refs.finderInput).querySelector('input').focus()
  },
  handleClick: function () {
    this.focusInput()
  },
  selectPrevious: function () {
    var index = this.refs.finderList.props.articles.indexOf(this.state.currentArticle)
    if (index > 0) {
      this.setState({currentArticle: this.refs.finderList.props.articles[index - 1]})
    }
  },
  selectNext: function () {
    var index = this.refs.finderList.props.articles.indexOf(this.state.currentArticle)
    if (index > -1 && index < this.refs.finderList.props.articles.length - 1) {
      this.setState({currentArticle: this.refs.finderList.props.articles[index + 1]})
    }
  },
  selectArticle: function (article) {
    this.setState({currentArticle: article})
  },
  handleChange: function (e) {
    this.setState({search: e.target.value}, function () {
      this.setState({currentArticle: this.refs.finderList.props.articles[0]})
    })
  },
  render: function () {
    var articles = this.searchArticle(this.state.search, this.state.articles)
    return (
      <div className='Finder'>
        <FinderInput ref='finderInput' onChange={this.handleChange} search={this.state.search}/>
        <FinderList ref='finderList' currentArticle={this.state.currentArticle} articles={articles} selectArticle={this.selectArticle}/>
        <FinderDetail currentArticle={this.state.currentArticle}/>
      </div>
    )
  }
})

React.render(<Finder/>, document.getElementById('content'))
