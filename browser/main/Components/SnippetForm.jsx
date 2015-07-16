var React = require('react/addons')
var ReactRouter = require('react-router')
var CodeEditor = require('./CodeEditor')
var Catalyst = require('../Mixins/Catalyst')
var Select = require('react-select')
var request = require('superagent')
var PlanetActions = require('../Actions/PlanetActions')

var getOptions = function (input, callback) {
  request
    .get('http://localhost:8000/tags/search')
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
    close: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      snippet: {
        description: '',
        mode: 'javascript',
        content: '',
        callSign: '',
        Tags: []
      }
    }
  },
  componentDidMount: function () {
    React.findDOMNode(this.refs.description).focus()
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
    var params = this.getParams()
    var userName = params.userName
    var planetName = params.planetName
    var snippet = Object.assign({}, this.state.snippet)
    snippet.Tags = snippet.Tags.map(function (tag) {
      return tag.value
    })
    PlanetActions.createSnippet(userName + '/' + planetName, snippet)
  },
  render: function () {
    return (
      <div className='SnippetForm'>
        <div className='modal-body'>
          <div className='form-group'>
            <textarea ref='description' className='snippetDescription block-input' valueLink={this.linkState('snippet.description')} placeholder='Description'/>
          </div>
          <div className='form-group'>
            <input className='inline-input' valueLink={this.linkState('snippet.callSign')} type='text' placeholder='Callsign'/>
            <select className='inline-input' valueLink={this.linkState('snippet.mode')}>
              <option value='javascript'>Javascript</option>
              <option value='html'>HTML</option>
              <option value='css'>CSS</option>
            </select>
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
            <button onClick={this.props.close} className='btn-default'>Cancle</button>
            <button onClick={this.submit} className='btn-primary'>Launch</button>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = SnippetForm
