/* global localStorage */
var remote = require('remote')
var hideFinder = remote.getGlobal('hideFinder')
var clipboard = require('clipboard')

var React = require('react/addons')

var FinderInput = require('./Components/FinderInput')
var FinderList = require('./Components/FinderList')
var FinderDetail = require('./Components/FinderDetail')

// filter start
function basicFilter (keyword, articles) {
  if (keyword === '' || keyword == null) return articles
  var firstFiltered = articles.filter(function (article) {

    var first = article.type === 'snippet' ? article.callSign : article.title
    if (first.match(new RegExp(keyword, 'i'))) return true

    return false
  })

  var secondFiltered = articles.filter(function (article) {
    var second = article.type === 'snippet' ? article.description : article.content
    if (second.match(new RegExp(keyword, 'i'))) return true

    return false
  })

  var thirdFiltered = articles.filter(function (article) {
    if (article.type === 'snippet') {
      if (article.content.match(new RegExp(keyword, 'i'))) return true
    }
    return false
  })

  return firstFiltered.concat(secondFiltered, thirdFiltered).filter(function (value, index, self) {
    return self.indexOf(value) === index
  })
}

function snippetFilter (articles) {
  return articles.filter(function (article) {
    return article.type === 'snippet'
  })
}

function blueprintFilter (articles) {
  return articles.filter(function (article) {
    return article.type === 'blueprint'
  })
}

function tagFilter (keyword, articles) {
  return articles.filter(function (article) {
    return article.Tags.some(function (tag) {
      return tag.name.match(new RegExp('^' + keyword, 'i'))
    })
  })
}

function searchArticle (search, articles) {
  var keywords = search.split(' ')

  for (var keyword of keywords) {
    if (keyword.match(/^\$s/, 'i')) {
      articles = snippetFilter(articles)
      continue
    } else if (keyword.match(/^\$b/, 'i')) {
      articles = blueprintFilter(articles)
      continue
    } else if (keyword.match(/^#[A-Za-z0-9]+/)) {
      articles = tagFilter(keyword.substring(1, keyword.length), articles)
      continue
    }
    articles = basicFilter(keyword, articles)
  }

  return articles
}
// Filter end

function fetchArticles () {
  var user = JSON.parse(localStorage.getItem('user'))
  if (user == null) {
    console.log('need to login')
    return []
  }

  var articles = []
  user.Planets.forEach(function (planet) {
    var _planet = JSON.parse(localStorage.getItem('planet-' + planet.id))
    articles = articles.concat(_planet.Snippets, _planet.Blueprints)
  })
  console.log(articles.length + ' articles')

  return articles
}

var Finder = React.createClass({
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
      currentArticle: articles[0],
      search: ''
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
      if (article.type === 'snippet') {
        clipboard.writeText(article.content)
        hideFinder()
        e.preventDefault()
      }
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
  handleChange: function (e) {
    this.setState({search: e.target.value}, function () {
      this.setState({currentArticle: this.refs.finderList.props.articles[0]})
    })
  },
  render: function () {
    var articles = searchArticle(this.state.search, this.state.articles)
    return (
      <div className='Finder'>
        <FinderInput ref='finderInput' onChange={this.handleChange} search={this.state.search}/>
        <FinderList ref='finderList' currentArticle={this.state.currentArticle} articles={articles}/>
        <FinderDetail currentArticle={this.state.currentArticle}/>
      </div>
    )
  }
})

React.render(<Finder/>, document.getElementById('content'))
