var React = require('react/addons')
var ReactRouter = require('react-router')
var CodeEditor = require('./CodeEditor')
var Catalyst = require('../Mixins/Catalyst')
var Select = require('react-select')
var request = require('superagent')
var PlanetActions = require('../Actions/PlanetActions')

var apiUrl = require('../../../config').apiUrl

var aceModes = require('../../../modules/ace-modes')

var getOptions = function (input, callback) {
  request
    .get(apiUrl + 'tags/search')
    .query({name: input})
    .send()
    .end(function (err, res) {
      if (err) {
        callback(err)
        return
      }
      callback(null, {
          options: res.body.map(function (tag) {
            return {
              label: tag.name,
              value: tag.name
            }
        }),
          complete: false
      })
    })
}

var SnippetForm = React.createClass({
  mixins: [Catalyst.LinkedStateMixin, ReactRouter.State],
  propTypes: {
    close: React.PropTypes.func,
    snippet: React.PropTypes.object
  },
  getInitialState: function () {
    var snippet = Object.assign({
      description: '',
      mode: '',
      content: '',
      callSign: '',
      Tags: []
    }, this.props.snippet)
    snippet.Tags = snippet.Tags.map(function (tag) {
      return {
        label: tag.name,
        value: tag.name
      }
    })
    return {
      snippet: snippet
    }
  },
  componentDidMount: function () {
    React.findDOMNode(this.refs.description).focus()
  },
  handleModeChange: function (selected) {
    var snippet = this.state.snippet
    snippet.mode = selected
    console.log(selected, 'selected')
    this.setState({snippet: snippet})
  },
  handleTagsChange: function (selected, all) {
    var snippet = this.state.snippet
    snippet.Tags = all
    this.setState({snippet: snippet})
  },
  handleContentChange: function (e, value) {
    var snippet = this.state.snippet
    snippet.content = value
    this.setState({snippet: snippet})
  },
  submit: function () {
    var snippet = Object.assign({}, this.state.snippet)
    snippet.Tags = snippet.Tags.map(function (tag) {
      return tag.value
    })
    if (this.props.snippet == null) {
      var params = this.getParams()
      var userName = params.userName
      var planetName = params.planetName

      PlanetActions.createSnippet(userName + '/' + planetName, snippet)
    } else {
      var snippetId = snippet.id
      delete snippet.id

      PlanetActions.updateSnippet(snippetId, snippet)
    }
  },
  handleKeyDown: function (e) {
    if (e.keyCode === 13 && e.metaKey) {
      this.submit()
      e.stopPropagation()
    }
  },
  render: function () {
    var modeOptions = aceModes.map(function (mode) {
      return {
        label: mode,
        value: mode
      }
    })
    return (
      <div onKeyDown={this.handleKeyDown} className='SnippetForm'>
        <div className='modal-body'>
          <div className='form-group'>
            <textarea ref='description' className='snippetDescription block-input' valueLink={this.linkState('snippet.description')} placeholder='Description'/>
          </div>
          <div className='form-group'>
            <input className='inline-input' valueLink={this.linkState('snippet.callSign')} type='text' placeholder='Callsign'/>
            <Select
              name='mode'
              className='modeSelect'
              value={this.state.snippet.mode}
              placeholder='Select Language'
              options={modeOptions}
              onChange={this.handleModeChange}/>
          </div>
          <div className='form-group'>
            <CodeEditor onChange={this.handleContentChange} code={this.state.snippet.content} mode={this.state.snippet.mode}/>
          </div>
          <div className='form-group'>
            <Select
              name='Tags'
              multi={true}
              allowCreate={true}
              value={this.state.snippet.Tags}
              placeholder='Tags...'
              asyncOptions={getOptions}
              onChange={this.handleTagsChange}
            />
          </div>
        </div>
        <div className='modal-footer'>
          <div className='modal-control'>
            <button onClick={this.props.close} className='btn-default'>Cancel</button>
            <button onClick={this.submit} className='btn-primary'>{this.props.snippet == null ? 'Launch' : 'Relaunch'}</button>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = SnippetForm
