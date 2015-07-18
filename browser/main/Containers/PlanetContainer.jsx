var React = require('react/addons')
var ReactRouter = require('react-router')
var moment = require('moment')
var ForceUpdate = require('../Mixins/ForceUpdate')
var ModalBase = require('../Components/ModalBase')
var LaunchModal = require('../Components/LaunchModal')
var CodeViewer = require('../Components/CodeViewer')
var SnippetEditModal = require('../Components/SnippetEditModal')
var SnippetDeleteModal = require('../Components/SnippetDeleteModal')

var AuthStore = require('../Stores/AuthStore')
var PlanetStore = require('../Stores/PlanetStore')

var PlanetActions = require('../Actions/PlanetActions')

var Markdown = require('../Mixins/Markdown')

var PlanetHeader = React.createClass({
  propTypes: {
    currentPlanet: React.PropTypes.object,
    currentUser: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      isMenuDropDownOpen: false
    }
  },
  toggleMenuDropDown: function () {
    this.setState({isMenuDropDownOpen: !this.state.isMenuDropDownOpen}, function () {
      if (this.state.isMenuDropDownOpen) {
        document.body.onclick = function () {
          this.setState({isMenuDropDownOpen: false}, function () {
            document.body.onclick = null
          })
        }.bind(this)
      }
    })
  },
  interceptClick: function (e) {
    e.stopPropagation()
  },
  render: function () {
    var currentPlanetName = this.props.currentPlanet.name

    return (
      <div onClick={this.interceptClick} className='PlanetHeader'>
        <span className='planetName'>{currentPlanetName}</span>
        <button onClick={this.toggleMenuDropDown} className={this.state.isMenuDropDownOpen ? 'menuBtn active' : 'menuBtn'}>
          <i className='fa fa-chevron-down'></i>
        </button>
        <div className={this.state.isMenuDropDownOpen ? 'dropDown' : 'dropDown hide'} ref='menuDropDown'>
          <a href='#'><i className='fa fa-wrench fa-fw'/> Planet Setting</a>
          <a href='#'><i className='fa fa-group fa-fw'/> Manage member</a>
          <a href='#'><i className='fa fa-trash fa-fw'/> Delete Planet</a>
        </div>
        <span className='searchInput'>
          <i className='fa fa-search'/>
          <input type='text' className='inline-input circleInput' placeholder='Search...'/>
        </span>
        <a className='downloadBtn btn-primary'>Download Mac app</a>
      </div>
    )
  }
})
var PlanetNavigator = React.createClass({
  propTypes: {
    currentPlanet: React.PropTypes.shape({
      name: React.PropTypes.string
    }),
    currentUser: React.PropTypes.shape({
      name: React.PropTypes.string
    })
  },
  getInitialState: function () {
    return {
      isLaunchModalOpen: false
    }
  },
  openLaunchModal: function () {
    console.log('and...OPEN!!')
    this.setState({isLaunchModalOpen: true})
  },
  closeLaunchModal: function () {
    this.setState({isLaunchModalOpen: false})
  },
  submitLaunchModal: function (ret) {
    console.log(ret)
    this.setState({isLaunchModalOpen: false})
  },
  render: function () {
    return (
      <div className='PlanetNavigator'>
        <button onClick={this.openLaunchModal} className='btn-primary btn-block'>
          <i className='fa fa-rocket fa-fw'/> Launch
        </button>
        <ModalBase isOpen={this.state.isLaunchModalOpen} close={this.closeLaunchModal}>
          <LaunchModal submit={this.submitLaunchModal} close={this.closeLaunchModal}/>
        </ModalBase>
        <nav>
          <a>
            <i className='fa fa-home fa-fw'/> Home
          </a>
          <a>
            <i className='fa fa-code fa-fw'/> Snippets
          </a>
          <a>
            <i className='fa fa-file-text-o fa-fw'/> Blueprints
          </a>
        </nav>
      </div>
    )
  }
})

var PlanetArticleList = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State, ForceUpdate(60000), Markdown],
  propTypes: {
    planet: React.PropTypes.shape({
      Snippets: React.PropTypes.array,
      Blueprints: React.PropTypes.array,
      Articles: React.PropTypes.array
    })
  },
  render: function () {
    var articles = this.props.planet.Articles.map(function (article) {
      var tags = article.Tags.length > 0 ? article.Tags.map(function (tag) {
        return (
          <a key={tag.id} href>#{tag.name}</a>
        )
      }) : (
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
                <div className='callSign'><i className='fa fa-code'></i> {article.callSign}</div>
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
              <div className='callSign'><i className='fa fa-file-text-o'></i> {article.title}</div>
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
        <ul>
          {articles}
        </ul>
      </div>
    )
  }
})

var PlanetArticleDetail = React.createClass({
  mixins: [ForceUpdate(60000), Markdown],
  propTypes: {
    article: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      isEditModalOpen: false
    }
  },
  openEditModal: function () {
    this.setState({isEditModalOpen: true})
  },
  closeEditModal: function () {
    this.setState({isEditModalOpen: false})
  },
  submitEditModal: function () {
    this.setState({isEditModalOpen: false})
  },
  openDeleteModal: function () {
    this.setState({isDeleteModalOpen: true})
  },
  closeDeleteModal: function () {
    this.setState({isDeleteModalOpen: false})
  },
  submitDeleteModal: function () {
    this.setState({isDeleteModalOpen: false})
  },
  render: function () {
    var article = this.props.article

    var tags = article.Tags.length > 0 ? article.Tags.map(function (tag) {
      return (
        <a key={tag.id} href>#{tag.name}</a>
      )
    }) : (
      <a className='noTag'>Not tagged yet</a>
    )
    if (article.type === 'snippet') {
      return (
        <div className='PlanetArticleDetail snippetDetail'>
          <div className='viewer-header'>
            <i className='fa fa-code'></i> {article.callSign} <small className='updatedAt'>{moment(article.updatedAt).fromNow()}</small>
            <span className='control-group'>
              <button onClick={this.openEditModal} className='btn-default btn-square btn-sm'><i className='fa fa-edit fa-fw'></i></button>
              <button onClick={this.openDeleteModal} className='btn-default btn-square btn-sm'><i className='fa fa-trash fa-fw'></i></button>
            </span>

            <ModalBase isOpen={this.state.isEditModalOpen} close={this.closeEditModal}>
              <SnippetEditModal snippet={article} submit={this.submitEditModal} close={this.closeEditModal}/>
            </ModalBase>

            <ModalBase isOpen={this.state.isDeleteModalOpen} close={this.closeDeleteModal}>
              <SnippetDeleteModal snippet={article} submit={this.submitDeleteModal} close={this.closeDeleteModal}/>
            </ModalBase>
          </div>
          <div className='viewer-body'>
            <div className='viewer-detail'>
              <div className='description'>{article.description}</div>
              <div className='tags'><i className='fa fa-tags'/>{tags}</div>
            </div>
            <div className='content'>
              <CodeViewer code={article.content} mode={article.mode}/>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className='PlanetArticleDetail blueprintDetail'>
        <div className='viewer-header'>
          <i className='fa fa-file-text-o'></i> {article.title} <small className='updatedAt'>{moment(article.updatedAt).fromNow()}</small>
          <span className='control-group'>
            <button onClick={this.openEditModal} className='btn-default btn-square btn-sm'><i className='fa fa-edit fa-fw'></i></button>
            <button onClick={this.openDeleteModal} className='btn-default btn-square btn-sm'><i className='fa fa-trash fa-fw'></i></button>
          </span>

          <ModalBase isOpen={this.state.isEditModalOpen} close={this.closeEditModal}>
            <SnippetEditModal snippet={article} submit={this.submitEditModal} close={this.closeEditModal}/>
          </ModalBase>

          <ModalBase isOpen={this.state.isDeleteModalOpen} close={this.closeDeleteModal}>
            <SnippetDeleteModal snippet={article} submit={this.submitDeleteModal} close={this.closeDeleteModal}/>
          </ModalBase>
        </div>
        <div className='viewer-body'>
          <div className='tags'><i className='fa fa-tags'/>{tags}</div>
          <div className='content' dangerouslySetInnerHTML={{__html: ' ' + this.markdown(article.content)}}></div>
        </div>
      </div>
    )

  }
})

module.exports = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State],
  propTypes: {
    params: React.PropTypes.object,
    planetName: React.PropTypes.string
  },
  getInitialState: function () {
    return {
      currentPlanet: null
    }
  },
  componentDidMount: function () {
    this.unsubscribe = PlanetStore.listen(this.onFetched)

    PlanetActions.fetchPlanet(this.props.params.userName + '/' + this.props.params.planetName)
  },
  componentWillUnmount: function () {
    this.unsubscribe()
  },
  onFetched: function (res) {
    var snippets = this.state.currentPlanet == null ? null : this.state.currentPlanet.Snippets
    var snippet = res.data

    switch (res.status) {
      case 'planetFetched':
        var planet = res.data
        this.setState({currentPlanet: planet}, function () {
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
        break
      case 'snippetCreated':
        if (snippet.PlanetId === this.state.currentPlanet.id) {
          snippets.unshift(snippet)
          this.setState({planet: this.state.currentPlanet}, function () {
            var params = this.getParams()
            params.localId = snippet.localId
            this.transitionTo('snippets', params)
          })
        }
        break
      case 'snippetUpdated':
        if (snippet.PlanetId === this.state.currentPlanet.id) {
          snippets.some(function (_snippet, index) {
            if (_snippet.id === snippet.id) {
              snippets.splice(index, 1)
              snippets.unshift(snippet)
              this.setState({snippets: snippets})
              return true
            }
            return false
          }.bind(this))
        }
        break
      case 'snippetDeleted':
        if (snippet.PlanetId === this.state.currentPlanet.id) {
          snippets.some(function (_snippet, index) {
            if (_snippet.id === snippet.id) {
              snippets.splice(index, 1)
              this.setState({snippets: snippets}, function () {
                var params = this.getParams()
                if (parseInt(params.localId, 10) === snippet.localId) {
                  if (snippets.length === 0) {
                    delete params.localId
                    this.transitionTo('planet', params)
                    return
                  }
                  if (index > 0) {
                    params.localId = snippets[index - 1].localId
                  } else {
                    params.localId = snippets[0].localId
                  }
                  this.transitionTo('snippets', params)
                }
              })
              return true
            }
            return false
          }.bind(this))
        }
    }

  },
  render: function () {
    var user = AuthStore.getUser()
    if (user == null) return (<div/>)
    if (this.state.currentPlanet == null) return (<div/>)

    var content = (<div>Nothing selected</div>)
    if (this.isActive('snippets')) {
      var localId = parseInt(this.props.params.localId, 10)

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
      var localId = parseInt(this.props.params.localId, 10)

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
        <PlanetHeader currentPlanet={this.state.currentPlanet} currentUser={user}/>
        <PlanetNavigator currentPlanet={this.state.currentPlanet} currentUser={user}/>
        <PlanetArticleList planet={this.state.currentPlanet}/>
        {content}
      </div>
    )
  }
})
