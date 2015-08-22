/* global localStorage*/
'strict'
var React = require('react/addons')
var ReactRouter = require('react-router')
var Reflux = require('reflux')

var PlanetHeader = require('../Components/PlanetHeader')
var PlanetNavigator = require('../Components/PlanetNavigator')
var PlanetArticleList = require('../Components/PlanetArticleList')
var PlanetArticleDetail = require('../Components/PlanetArticleDetail')

var Hq = require('../Services/Hq')

var Modal = require('../Mixins/Modal')
var ArticleFilter = require('../Mixins/ArticleFilter')
var Helper = require('../Mixins/Helper')
var KeyCaster = require('../Mixins/KeyCaster')

var UserStore = require('../Stores/UserStore')
var PlanetStore = require('../Stores/PlanetStore')

module.exports = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State, Modal, Reflux.listenTo(UserStore, 'onUserChange'), Reflux.listenTo(PlanetStore, 'onPlanetChange'), ArticleFilter, Helper, KeyCaster('planetContainer')],
  propTypes: {
    params: React.PropTypes.object,
    planetName: React.PropTypes.string
  },
  getInitialState: function () {
    return {
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      planet: null,
      search: ''
    }
  },
  componentDidMount: function () {
    this.fetchPlanet(this.props.params.userName, this.props.params.planetName)
  },
  componentDidUpdate: function () {
    if (this.isActive('planetHome') && this.refs.list != null && this.refs.list.props.articles.length > 0) {
      var article = this.refs.list.props.articles[0]
      var planet = this.state.planet
      switch (article.type) {
        case 'code':
          this.transitionTo('codes', {userName: planet.userName, planetName: planet.name, localId: article.localId})
          break
        case 'note':
          this.transitionTo('notes', {userName: planet.userName, planetName: planet.name, localId: article.localId})
          break
      }
    }
  },
  componentWillReceiveProps: function (nextProps) {
    if (this.state.planet == null) {
      this.fetchPlanet(nextProps.params.userName, nextProps.params.planetName)
      return
    }

    if (nextProps.params.userName !== this.state.planet.userName || nextProps.params.planetName !== this.state.planet.name) {
      this.setState({
        planet: null
      }, function () {
        this.fetchPlanet(nextProps.params.userName, nextProps.params.planetName)
      })
    }
  },
  onKeyCast: function (e) {
    switch (e.status) {
      case 'openLaunchModal':
        this.refs.navigator.openLaunchModal()
        break
      case 'selectNextArticle':
        this.selectNextArticle()
        break
      case 'selectPriorArticle':
        this.selectPriorArticle()
        break
      case 'toggleFocusSearchInput':
        this.toggleFocusSearchInput()
        break
      case 'openEditModal':
        this.refs.detail.openEditModal()
        break
      case 'openDeleteModal':
        this.refs.detail.openDeleteModal()
        break
    }
  },
  onPlanetChange: function (res) {
    if (this.state.planet == null) return

    var planet, code, note, articleIndex, articlesCount
    switch (res.status) {
      case 'updated':
        planet = res.data
        if (this.state.planet.id === planet.id) {
          if (this.state.planet.name === planet.name) {
            this.setState({planet: planet})
          } else {
            this.transitionTo('planetHome', {userName: planet.userName, planetName: planet.name})
          }
        }
        break
      case 'destroyed':
        planet = res.data
        if (this.state.planet.id === planet.id) {
          this.transitionTo('userHome', {userName: this.state.planet.userName})
        }
        break
      case 'codeUpdated':
        code = res.data
        if (code.PlanetId === this.state.planet.id) {
          this.state.planet.Codes = this.updateItemToTargetArray(code, this.state.planet.Codes)

          this.setState({planet: this.state.planet})
        }
        break
      case 'noteUpdated':
        note = res.data
        if (note.PlanetId === this.state.planet.id) {
          this.state.planet.Notes = this.updateItemToTargetArray(note, this.state.planet.Notes)

          this.setState({planet: this.state.planet})
        }
        break
      case 'codeDestroyed':
        code = res.data
        if (code.PlanetId === this.state.planet.id) {
          this.state.planet.Codes = this.deleteItemFromTargetArray(code, this.state.planet.Codes)

          if (this.refs.detail.props.article != null && this.refs.detail.props.article.type === code.type && this.refs.detail.props.article.localId === code.localId) {
            articleIndex = this.getFilteredIndexOfCurrentArticle()
            articlesCount = this.refs.list.props.articles.length

            this.setState({planet: this.state.planet}, function () {
              if (articlesCount > 1) {
                if (articleIndex > 0) {
                  this.selectArticleByListIndex(articleIndex - 1)
                } else {
                  this.selectArticleByListIndex(articleIndex)
                }
              }
            })
            return
          }

          this.setState({planet: this.state.planet})
        }
        break
      case 'noteDestroyed':
        note = res.data
        if (note.PlanetId === this.state.planet.id) {
          this.state.planet.Notes = this.deleteItemFromTargetArray(note, this.state.planet.Notes)

          if (this.refs.detail.props.article != null && this.refs.detail.props.article.type === note.type && this.refs.detail.props.article.localId === note.localId) {
            articleIndex = this.getFilteredIndexOfCurrentArticle()
            articlesCount = this.refs.list.props.articles.length

            this.setState({planet: this.state.planet}, function () {
              if (articlesCount > 1) {
                if (articleIndex > 0) {
                  this.selectArticleByListIndex(articleIndex - 1)
                } else {
                  this.selectArticleByListIndex(articleIndex)
                }
              }
            })
            return
          }

          this.setState({planet: this.state.planet})
        }
        break
    }
  },
  onUserChange: function () {

  },
  fetchPlanet: function (userName, planetName) {
    if (userName == null) userName = this.props.params.userName
    if (planetName == null) planetName = this.props.params.planetName

    Hq.fetchPlanet(userName, planetName)
      .then(function (res) {
        var planet = res.body

        planet.Codes.forEach(function (code) {
          code.type = 'code'
        })

        planet.Notes.forEach(function (note) {
          note.type = 'note'
        })

        localStorage.setItem('planet-' + planet.id, JSON.stringify(planet))

        this.setState({planet: planet})
      }.bind(this))
      .catch(function (err) {
        console.error(err)
      })
  },
  getFilteredIndexOfCurrentArticle: function () {
    var params = this.props.params
    var index = 0

    if (this.isActive('codes')) {
      this.refs.list.props.articles.some(function (_article, _index) {
        if (_article.type === 'code' && _article.localId === parseInt(params.localId, 10)) {
          index = _index
        }
      })
    } else if (this.isActive('notes')) {
      this.refs.list.props.articles.some(function (_article, _index) {
        if (_article.type === 'note' && _article.localId === parseInt(params.localId, 10)) {
          index = _index
          return true
        }
        return false
      })
    }

    return index
  },
  selectArticleByListIndex: function (index) {
    var article = this.refs.list.props.articles[index]
    var params = this.props.params

    if (article == null) {
      this.transitionTo('planetHome', params)
      return
    }

    if (article.type === 'code') {
      params.localId = article.localId
      this.transitionTo('codes', params)
      return
    }

    if (article.type === 'note') {
      params.localId = article.localId
      this.transitionTo('notes', params)
      return
    }
  },
  selectNextArticle: function () {
    if (this.state.planet == null) return

    var index = this.getFilteredIndexOfCurrentArticle()

    if (index < this.refs.list.props.articles.length - 1) {
      this.selectArticleByListIndex(index + 1)
    }
  },
  selectPriorArticle: function () {
    if (this.state.planet == null) {
      return
    }
    var index = this.getFilteredIndexOfCurrentArticle()

    if (index > 0) {
      this.selectArticleByListIndex(index - 1)
    } else {
      React.findDOMNode(this.refs.header.refs.search).focus()
    }
  },
  toggleFocusSearchInput: function () {
    var search = React.findDOMNode(this.refs.header.refs.search)
    if (document.activeElement === search) {
      React.findDOMNode(this.refs.header.refs.search).blur()
      return
    }
    React.findDOMNode(this.refs.header.refs.search).focus()
  },
  handleSearchChange: function (e) {
    this.setState({search: e.target.value}, function () {
      this.selectArticleByListIndex(0)
    })
  },
  showAll: function () {
    this.setState({search: ''})
  },
  toggleCodeFilter: function () {
    var keywords = typeof this.state.search === 'string' ? this.state.search.split(' ') : []

    var usingCodeFilter = false
    var usingNoteFilter = false
    keywords = keywords.filter(function (keyword) {
      if (keyword === '$n') {
        usingNoteFilter = true
        return false
      }
      if (keyword === '$c') usingCodeFilter = true
      return true
    })

    if (usingCodeFilter && !usingNoteFilter) {
      keywords = keywords.filter(function (keyword) {
        return keyword !== '$c'
      })
    }

    if (!usingCodeFilter) {
      keywords.unshift('$c')
    }

    this.setState({search: keywords.join(' ')}, function () {
      this.selectArticleByListIndex(0)
    })
  },
  toggleNoteFilter: function () {
    var keywords = typeof this.state.search === 'string' ? this.state.search.split(' ') : []

    var usingCodeFilter = false
    var usingNoteFilter = false
    keywords = keywords.filter(function (keyword) {
      if (keyword === '$c') {
        usingCodeFilter = true
        return false
      }
      if (keyword === '$n') usingNoteFilter = true
      return true
    })

    if (usingNoteFilter && !usingCodeFilter) {
      keywords = keywords.filter(function (keyword) {
        return keyword !== '$n'
      })
    }

    if (!usingNoteFilter) {
      keywords.unshift('$n')
    }

    this.setState({search: keywords.join(' ')}, function () {
      this.selectArticleByListIndex(0)
    })
  },
  applyTagFilter: function (tag) {
    return function () {
      this.setState({search: '#' + tag})
    }.bind(this)
  },
  render: function () {
    if (this.state.planet == null) return (<div/>)

    var localId = parseInt(this.props.params.localId, 10)

    var codes = this.state.planet.Codes
    var notes = this.state.planet.Notes

    var article
    if (this.isActive('codes')) {
      codes.some(function (_article) {
        if (localId === _article.localId) {
          article = _article
          return true
        }
        return false
      })
    } else if (this.isActive('notes')) {
      notes.some(function (_article) {
        if (localId === _article.localId) {
          article = _article
          return true
        }
        return false
      })
    }

    var articles = codes.concat(notes)

    var filteredArticles = this.searchArticle(this.state.search, articles)

    return (
      <div className='PlanetContainer'>
        <PlanetHeader
          ref='header'
          search={this.state.search}
          fetchPlanet={this.fetchPlanet}
          onSearchChange={this.handleSearchChange}
          currentPlanet={this.state.planet}
        />

        <PlanetNavigator
          ref='navigator'
          search={this.state.search}
          showAll={this.showAll}
          toggleCodeFilter={this.toggleCodeFilter}
          toggleNoteFilter={this.toggleNoteFilter}
          planet={this.state.planet}/>

        <PlanetArticleList showOnlyWithTag={this.applyTagFilter} ref='list' articles={filteredArticles}/>

        <PlanetArticleDetail
          ref='detail'
          article={article}
          planet={this.state.planet}
          showOnlyWithTag={this.applyTagFilter}/>
      </div>
    )
  }
})
