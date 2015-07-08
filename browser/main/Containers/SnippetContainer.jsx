var React = require('react/addons')
var Snippet = require('../Services/Snippet')
var CodeViewer = require('../Components/CodeViewer')

var SnippetList = React.createClass({
  propTypes: {
    snippets: React.PropTypes.array,
    selectSnippet: React.PropTypes.func,
    currentSnippet: React.PropTypes.object
  },
  itemClickHandlerFactory: function (snippet) {
    return function () {
      this.props.selectSnippet(snippet)
    }.bind(this)
  },
  render: function () {
    var snippets = this.props.snippets.map(function (snippet) {
      var tags = snippet.Tags.map(function (tag) {
        return (
          <a key={tag.id} href>#{tag.name}</a>
        )
      })
      return (
        <li className={this.props.currentSnippet.id === snippet.id ? 'active' : ''} key={snippet.id} onClick={this.itemClickHandlerFactory(snippet)}>
          <div className='callSign'><i className='fa fa-code'></i> {snippet.callSign}</div>
          <div className='description'>{snippet.description}</div>
          <div className='updatedAt'>{snippet.updatedAt}</div>
          <div className='tags'><i className='fa fa-tags'/>{tags}</div>
        </li>
      )
    }.bind(this))

    return (
      <div className='SnippetList'>
        <div className='search'><input className='block-input' type='text' placeholder='Search...'/></div>
        <ul>
          {snippets}
        </ul>
      </div>
    )
  }
})

var SnippetViewer = React.createClass({
  propTypes: {
    snippet: React.PropTypes.object
  },
  render: function () {
    var snippet = this.props.snippet
    var content
    if (snippet != null) {
      var tags = snippet.Tags.map(function (tag) {
        return (
          <a key={tag.id} href>#{tag.name}</a>
        )
      })
      content = (
        <div className='SnippetViewer'>
          <div className='viewer-header'>
            <i className='fa fa-code'></i> {snippet.callSign} <small className='updatedAt'>{snippet.updatedAt}</small>
            <span className='control-group'>
              <button className='btn-default btn-square btn-sm'><i className='fa fa-edit fa-fw'></i></button>
              <button className='btn-default btn-square btn-sm'><i className='fa fa-trash fa-fw'></i></button>
            </span>
          </div>
          <div className='viewer-body'>
            <div className='viewer-detail'>
              <div className='description'>{snippet.description}</div>
              <div className='tags'><i className='fa fa-tags'/>{tags}</div>
            </div>
            <div className='content'>
              <CodeViewer code={snippet.content} mode={snippet.mode}/>
            </div>
          </div>
        </div>
      )
    } else {
      content = (
        <div className='SnippetViewer'>
          Not selected
        </div>
      )
    }
    return content
  }
})

var SnippetContainer = React.createClass({
  propTypes: {
    params: React.PropTypes.shape({
      planetName: React.PropTypes.string
    })
  },
  getInitialState: function () {
    return {
      snippets: [],
      curentSnippet: {}
    }
  },
  componentDidMount: function () {
    Snippet.getByPlanet(this.props.params.planetName)
      .then(function (snippets) {
        this.setState({snippets: snippets, currentSnippet: snippets.length > 0 ? snippets[0] : null})
      }.bind(this))
  },
  selectSnippet: function (snippet) {
    this.setState({currentSnippet: snippet})
  },
  updateSnippet: function (snippet) {
    var snippets = this.state.snippets.map(function (_snippet) {
      if (snippet.id === _snippet.id) {
        return snippet
      }
      return _snippet
    })
    var currentSnippet = this.state.currentSnippet.id === snippet.id ? snippet : this.state.currentSnippet

    this.setState({snippets: snippets, currentSnippet: currentSnippet})
  },
  destroySnippet: function (snippet) {
    var snippets = this.state.snippets
    var currentSnippet = this.state.currentSnippet
    if (currentSnippet.id === snippet.id) {
      var index
      snippets.some(function (_snippet, _index) {
        if (snippet.id === _snippet.id) {
          index = _index
          return true
        }
        return false
      })

      if (index == null) {
        index = 0
      } else if (index > snippet.length - 1) {
        index--
      } else {
        index++
      }

      if (snippets.length > 0) {
        currentSnippet = snippets[index]
      } else {
        currentSnippet = {}
      }
    }

    snippets = snippets.filter(function (_snippet, index) {
      if (snippet.id === _snippet.id) {
        return false
      }
      return true
    })

    this.setState({snippets: snippets, currentSnippet: currentSnippet})
  },
  render: function () {
    return (
      <div className='SnippetContainer'>
        <SnippetList selectSnippet={this.selectSnippet} snippets={this.state.snippets} currentSnippet={this.state.currentSnippet}/>
        <SnippetViewer snippet={this.state.currentSnippet}/>
      </div>
    )
  }
})

module.exports = SnippetContainer
