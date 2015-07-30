var React = require('react/addons')
var ReactRouter = require('react-router')

var PlanetHeader = require('../Components/PlanetHeader')
var PlanetNavigator = require('../Components/PlanetNavigator')
var PlanetArticleList = require('../Components/PlanetArticleList')
var PlanetArticleDetail = require('../Components/PlanetArticleDetail')
var ModalBase = require('../Components/ModalBase')
var LaunchModal = require('../Components/LaunchModal')
var SnippetEditModal = require('../Components/SnippetEditModal')
var SnippetDeleteModal = require('../Components/SnippetDeleteModal')
var BlueprintEditModal = require('../Components/BlueprintEditModal')
var BlueprintDeleteModal = require('../Components/BlueprintDeleteModal')
var PlanetAddUserModal = require('../Components/PlanetAddUserModal')
var PlanetSettingModal = require('../Components/PlanetSettingModal')
var PersonalSettingModal = require('../Components/PersonalSettingModal')

var PlanetActions = require('../Actions/PlanetActions')

var AuthStore = require('../Stores/AuthStore')
var PlanetStore = require('../Stores/PlanetStore')

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

module.exports = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State],
  propTypes: {
    params: React.PropTypes.object,
    planetName: React.PropTypes.string
  },
  getInitialState: function () {
    return {
      currentUser: AuthStore.getUser(),
      currentPlanet: null,
      search: '',
      isFetched: false,
      isLaunchModalOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      isAddUserModalOpen: false,
      isSettingModalOpen: false,
      isPersonalSettingModalOpen: false
    }
  },
  componentDidMount: function () {
    this.unsubscribePlanet = PlanetStore.listen(this.onFetched)
    this.unsubscribeAuth = AuthStore.listen(this.onListenAuth)

    PlanetActions.fetchPlanet(this.props.params.userName, this.props.params.planetName)
  },
  componentWillUnmount: function () {
    this.unsubscribePlanet()
    this.unsubscribeAuth()
  },
  componentDidUpdate: function () {
    if (this.state.currentPlanet == null || this.state.currentPlanet.name !== this.props.params.planetName || this.state.currentPlanet.userName !== this.props.params.userName) {
      PlanetActions.fetchPlanet(this.props.params.userName, this.props.params.planetName)
      this.focus()
    }
  },
  getFilteredIndexOfCurrentArticle: function () {
    var params = this.props.params
    var index = 0

    if (this.isActive('snippets')) {
      this.refs.list.props.articles.some(function (_article, _index) {
        if (_article.type === 'snippet' && _article.localId === parseInt(params.localId, 10)) {
          index = _index
        }
      })
    } else if (this.isActive('blueprints')) {
      this.refs.list.props.articles.some(function (_article, _index) {
        if (_article.type === 'blueprint' && _article.localId === parseInt(params.localId, 10)) {
          index = _index
          return true
        }
        return false
      })
    }

    return index
  },
  getIndexOfCurrentArticle: function () {
    var params = this.props.params
    var index = 0

    if (this.isActive('snippets')) {
      this.state.currentPlanet.Articles.some(function (_article, _index) {
        if (_article.type === 'snippet' && _article.localId === parseInt(params.localId, 10)) {
          index = _index
        }
      })
    } else if (this.isActive('blueprints')) {
      this.state.currentPlanet.Articles.some(function (_article, _index) {
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
    var article = this.refs.list.props.articles[index]
    var params = this.props.params

    if (article == null) {
      this.transitionTo('planetHome', params)
      return
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
    if (this.state.currentPlanet == null) return

    var index = this.getFilteredIndexOfCurrentArticle()

    if (index < this.refs.list.props.articles.length - 1) {
      this.selectArticleByIndex(index + 1)
    }
  },
  selectPriorArticle: function () {
    if (this.state.currentPlanet == null) {
      return
    }
    var index = this.getFilteredIndexOfCurrentArticle()

    if (index > 0) {
      this.selectArticleByIndex(index - 1)
    } else {
      React.findDOMNode(this).querySelector('.PlanetHeader .searchInput input').focus()
    }
  },
  onListenAuth: function (res) {
    if (res.status === 'userProfileUpdated') {
      if (this.state.currentPlanet != null) {
        res.data.Planets.some(function (planet) {
          if (planet.id === this.state.currentPlanet.id) {
            this.transitionTo('planet', {userName: planet.userName, planetName: planet.name})
            return true
          }
          return false
        }.bind(this))
      }
    }
  },
  onFetched: function (res) {
    if (res == null) {
      return
    }

    var articles = this.state.currentPlanet == null ? null : this.state.currentPlanet.Articles

    var planet
    if (res.status === 'planetFetched') {
      planet = res.data
      this.setState({isFetched: true, currentPlanet: planet, filteredArticles: planet.Articles}, function () {
        if (this.refs.detail.props.article == null) {
          var params = this.props.params
          delete params.localId

          var articles = this.refs.list.props.articles
          if (articles.length > 0) {
            console.log('need to redirect', this.refs.list.props.articles)
            var article = articles[0]
            params.localId = article.localId

            if (article.type === 'snippet') {
              this.transitionTo('snippets', params)
            } else {
              this.transitionTo('blueprints', params)
            }
          }
        }
      })
      return
    }

    if (res.status === 'planetDeleted') {
      planet = res.data
      this.transitionTo('user', {
        userName: this.props.params.userName
      })
      return
    }

    var user
    if (res.status === 'userAdded') {
      user = res.data
      if (user == null) {
        return null
      }
      this.state.currentPlanet.Users.push(user)
      this.setState({currentPlanet: this.state.currentPlanet}, function () {
        if (this.state.isAddUserModalOpen) {this.closeAddUserModal()}
      })
      return
    }

    if (res.status === 'userRemoved') {
      user = res.data
      if (user == null) {
        return null
      }
      this.state.currentPlanet.Users.some(function (_user, index) {
        if (user.id === _user.id) {
          this.state.currentPlanet.Users.splice(index, 1)
          return true
        }
        return false
      }.bind(this))
      this.setState({currentPlanet: this.state.currentPlanet}, function () {
        if (this.state.isAddUserModalOpen) {this.closeAddUserModal()}
      })
      return
    }

    if (res.status === 'nameChanged') {
      var params = Object.assign({}, this.props.params)
      params.planetName = res.data.name
      this.transitionTo('planet', params)
      return
    }

    var article = res.data
    var filteredIndex = this.getFilteredIndexOfCurrentArticle()
    var index = this.getIndexOfCurrentArticle()

    if (article.PlanetId === this.state.currentPlanet.id) {
      switch (res.status) {
        case 'articleCreated':
          articles.unshift(article)

          this.setState({planet: this.state.currentPlanet, search: ''}, function () {
            this.closeLaunchModal()
            this.selectArticleByIndex(0)
          })
          break
        case 'articleUpdated':
          articles.splice(index, 1)
          articles.unshift(article)

          this.setState({planet: this.state.currentPlanet}, function () {
            this.closeEditModal()
          })
          break
        case 'articleDeleted':
          articles.splice(index, 1)

          this.setState({planet: this.state.currentPlanet}, function () {
            this.closeDeleteModal()
            if (index > 0) {
              this.selectArticleByIndex(filteredIndex - 1)
            } else {
              this.selectArticleByIndex(filteredIndex)
            }
          })
      }
    }
  },
  handleSearchChange: function (e) {
    this.setState({search: e.target.value}, function () {
      this.selectArticleByIndex(0)
    })
  },
  showAll: function () {
    this.setState({search: ''})
  },
  toggleSnippetFilter: function () {
    var keywords = typeof this.state.search === 'string' ? this.state.search.split(' ') : []

    var usingSnippetFilter = false
    var usingBlueprintFilter = false
    keywords = keywords.filter(function (keyword) {
      if (keyword === '$b') {
        usingBlueprintFilter = true
        return false
      }
      if (keyword === '$s') usingSnippetFilter = true
      return true
    })

    if (usingSnippetFilter && !usingBlueprintFilter) {
      keywords = keywords.filter(function (keyword) {
        return keyword !== '$s'
      })
    }

    if (!usingSnippetFilter) {
      keywords.unshift('$s')
    }

    this.setState({search: keywords.join(' ')}, function () {
      this.selectArticleByIndex(0)
    })
  },
  toggleBlueprintFilter: function () {
    var keywords = typeof this.state.search === 'string' ? this.state.search.split(' ') : []

    var usingSnippetFilter = false
    var usingBlueprintFilter = false
    keywords = keywords.filter(function (keyword) {
      if (keyword === '$s') {
        usingSnippetFilter = true
        return false
      }
      if (keyword === '$b') usingBlueprintFilter = true
      return true
    })

    if (usingBlueprintFilter && !usingSnippetFilter) {
      keywords = keywords.filter(function (keyword) {
        return keyword !== '$b'
      })
    }

    if (!usingBlueprintFilter) {
      keywords.unshift('$b')
    }

    this.setState({search: keywords.join(' ')}, function () {
      this.selectArticleByIndex(0)
    })
  },
  showOnlyWithTag: function (tag) {
    return function () {
      this.setState({search: '#' + tag})
    }.bind(this)
  },
  openLaunchModal: function () {
    this.setState({isLaunchModalOpen: true})
  },
  closeLaunchModal: function () {
    this.setState({isLaunchModalOpen: false}, function () {
      this.focus()
    })
  },
  openAddUserModal: function () {
    this.setState({isAddUserModalOpen: true})
  },
  closeAddUserModal: function () {
    this.setState({isAddUserModalOpen: false}, function () {
      this.focus()
    })
  },
  openEditModal: function () {
    if (this.refs.detail.props.article == null) {return}
    this.setState({isEditModalOpen: true})
  },
  closeEditModal: function () {
    this.setState({isEditModalOpen: false}, function () {
      this.focus()
    })
  },
  submitEditModal: function () {
    this.setState({isEditModalOpen: false})
  },
  openDeleteModal: function () {
    if (this.refs.detail.props.article == null) {return}
    this.setState({isDeleteModalOpen: true})
  },
  closeDeleteModal: function () {
    this.setState({isDeleteModalOpen: false}, function () {
      this.focus()
    })
  },
  submitDeleteModal: function () {
    this.setState({isDeleteModalOpen: false})
  },
  openSettingModal: function () {
    this.setState({isSettingModalOpen: true})
  },
  closeSettingModal: function () {
    this.setState({isSettingModalOpen: false}, function () {
      this.focus()
    })
  },
  openPersonalSettingModal: function () {
    this.setState({isPersonalSettingModalOpen: true})
  },
  closePersonalSettingModal: function () {
    this.setState({isPersonalSettingModalOpen: false}, function () {
      this.focus()
    })
  },
  focus: function () {
    React.findDOMNode(this).focus()
  },
  handleKeyDown: function (e) {
    // Bypath for modal open state
    if (this.state.isLaunchModalOpen) {
      if (e.keyCode === 27) {
        this.closeLaunchModal()
      }
      return
    }
    if (this.state.isEditModalOpen) {
      if (e.keyCode === 27) {
        this.closeEditModal()
      }
      return
    }
    if (this.state.isDeleteModalOpen) {
      if (e.keyCode === 27) {
        this.closeDeleteModal()
      }
      return
    }
    if (this.state.isAddUserModalOpen) {
      if (e.keyCode === 27) {
        this.closeAddUserModal()
      }
      return
    }
    if (this.state.isSettingModalOpen) {
      if (e.keyCode === 27) {
        this.closeSettingModal()
      }
      return
    }

    if (this.state.isPersonalSettingModalOpen) {
      if (e.keyCode === 27) {
        this.closePersonalSettingModal()
      }
      return
    }

    // LaunchModal
    if ((e.keyCode === 13 && e.metaKey)) {
      e.preventDefault()
      this.openLaunchModal()
    }

    // Focus(blur) search input
    var searchInput = React.findDOMNode(this).querySelector('.PlanetHeader .searchInput input')

    if (document.activeElement === searchInput) {
      switch (e.keyCode) {
        case 38:
          this.focus()
          break
        case 40:
          e.preventDefault()
          this.focus()
          break
        case 27:
          e.preventDefault()
          this.focus()
          break
      }
      return
    }

    // Article indexing
    if (document.activeElement !== searchInput) {
      switch (e.keyCode) {
        case 38:
          e.preventDefault()
          this.selectPriorArticle()
          break
        case 40:
          e.preventDefault()
          this.selectNextArticle()
          break
        case 27:
          searchInput.focus()
          break
      }

      // Other hotkeys
      switch (e.keyCode) {
        case 65:
          e.preventDefault()
          this.openLaunchModal()
          break
        case 68:
          e.preventDefault()
          this.openDeleteModal()
          break
        case 69:
          e.preventDefault()
          this.openEditModal()
      }
    }

  },
  render: function () {
    if (this.state.currentUser == null) return (<div/>)
    if (this.state.currentPlanet == null) return (<div/>)

    var localId = parseInt(this.props.params.localId, 10)

    var article
    if (this.isActive('snippets')) {
      this.state.currentPlanet.Articles.some(function (_article) {
        if (_article.type === 'snippet' && localId === _article.localId) {
          article = _article
          return true
        }
        return false
      })
    } else if (this.isActive('blueprints')) {
      this.state.currentPlanet.Articles.some(function (_article) {
        if (_article.type === 'blueprint' && localId === _article.localId) {
          article = _article
          return true
        }
        return false
      })
    }

    var filteredArticles = this.state.isFetched ? searchArticle(this.state.search, this.state.currentPlanet.Articles) : []

    var editModal = article != null ? (article.type === 'snippet' ? (
      <SnippetEditModal snippet={article} submit={this.submitEditModal} close={this.closeEditModal}/>
    ) : (
      <BlueprintEditModal blueprint={article} submit={this.submitEditModal} close={this.closeEditModal}/>
    )) : null

    var deleteModal = article != null ? (article.type === 'snippet' ? (
      <SnippetDeleteModal snippet={article} close={this.closeDeleteModal}/>
    ) : (
      <BlueprintDeleteModal blueprint={article} close={this.closeDeleteModal}/>
    )) : null

    return (
      <div tabIndex='1' onKeyDown={this.handleKeyDown} className='PlanetContainer'>
        <ModalBase isOpen={this.state.isLaunchModalOpen} close={this.closeLaunchModal}>
          <LaunchModal close={this.closeLaunchModal}/>
        </ModalBase>

        <ModalBase isOpen={this.state.isEditModalOpen} close={this.closeEditModal}>
          {editModal}
        </ModalBase>

        <ModalBase isOpen={this.state.isDeleteModalOpen} close={this.closeDeleteModal}>
          {deleteModal}
        </ModalBase>

        <ModalBase isOpen={this.state.isAddUserModalOpen} close={this.closeAddUserModal}>
          <PlanetAddUserModal close={this.closeAddUserModal}/>
        </ModalBase>

        <ModalBase isOpen={this.state.isSettingModalOpen} close={this.closeSettingModal}>
          <PlanetSettingModal currentPlanet={this.state.currentPlanet} close={this.closeSettingModal}/>
        </ModalBase>

        <ModalBase isOpen={this.state.isPersonalSettingModalOpen} close={this.closePersonalSettingModal}>
          <PersonalSettingModal currentUser={this.state.currentUser} close={this.closePersonalSettingModal}/>
        </ModalBase>

        <PlanetHeader search={this.state.search}
          openSettingModal={this.openSettingModal}
          openPersonalSettingModal={this.openPersonalSettingModal} onSearchChange={this.handleSearchChange} currentPlanet={this.state.currentPlanet}/>

        <PlanetNavigator openLaunchModal={this.openLaunchModal} openAddUserModal={this.openAddUserModal}
          search={this.state.search}
          showAll={this.showAll}
          toggleSnippetFilter={this.toggleSnippetFilter} toggleBlueprintFilter={this.toggleBlueprintFilter} currentPlanet={this.state.currentPlanet}/>

        <PlanetArticleList showOnlyWithTag={this.showOnlyWithTag} ref='list' articles={filteredArticles}/>

        <PlanetArticleDetail ref='detail' article={article} onOpenEditModal={this.openEditModal} onOpenDeleteModal={this.openDeleteModal} showOnlyWithTag={this.showOnlyWithTag}/>
      </div>
    )
  }
})
