/* global localStorage*/
'strict'
var React = require('react/addons')
var ReactRouter = require('react-router')
var Reflux = require('reflux')

var PlanetHeader = require('../Components/PlanetHeader')
var PlanetNavigator = require('../Components/PlanetNavigator')
var PlanetArticleList = require('../Components/PlanetArticleList')
var PlanetArticleDetail = require('../Components/PlanetArticleDetail')

var Modal = require('../Mixins/Modal')
var ArticleFilter = require('../Mixins/ArticleFilter')

var Hq = require('../Services/Hq')

var UserStore = require('../Stores/UserStore')
var PlanetStore = require('../Stores/PlanetStore')

module.exports = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State, Modal, Reflux.listenTo(UserStore, 'onUserChange'), Reflux.listenTo(PlanetStore, 'onPlanetChange'), ArticleFilter],
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
      console.log(article)
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
  onPlanetChange: function (res) {
    if (this.state.planet == null) return

    var code, codes, note, notes, isNew, articleIndex, articlesCount
    switch (res.status) {
      case 'codeUpdated':
        code = res.data
        if (code.PlanetId === this.state.planet.id) {
          codes = this.state.planet.Codes
          isNew = !codes.some(function (_code, index) {
            if (code.localId === _code.localId) {
              codes.splice(index, 1, code)
              return true
            }
            return false
          })

          if (isNew) {
            codes.unshift(code)
          }

          this.setState({planet: this.state.planet})
        }
        break
      case 'noteUpdated':
        note = res.data
        if (note.PlanetId === this.state.planet.id) {
          notes = this.state.planet.Notes
          isNew = !notes.some(function (_note, index) {
            if (note.localId === _note.localId) {
              notes.splice(index, 1, note)
              return true
            }
            return false
          })

          if (isNew) {
            notes.unshift(note)
          }

          this.setState({planet: this.state.planet})
        }
        break
      case 'codeDestroyed':
        code = res.data
        if (code.PlanetId === this.state.planet.id) {
          codes = this.state.planet.Codes
          codes.some(function (_code, index) {
            if (code.localId === _code.localId) {
              codes.splice(index, 1)
              return true
            }
            return false
          })

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
        }
        break
      case 'noteDestroyed':
        note = res.data
        if (note.PlanetId === this.state.planet.id) {
          notes = this.state.planet.Notes
          notes.some(function (_note, index) {
            if (note.localId === _note.localId) {
              notes.splice(index, 1)
              return true
            }
            return false
          })

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
      React.findDOMNode(this).querySelector('.PlanetHeader .searchInput input').focus()
    }
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
      this.selectArticleByIndex(0)
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
      this.selectArticleByIndex(0)
    })
  },
  applyTagFilter: function (tag) {
    return function () {
      this.setState({search: '#' + tag})
    }.bind(this)
  },
  focus: function () {
    React.findDOMNode(this).focus()
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
