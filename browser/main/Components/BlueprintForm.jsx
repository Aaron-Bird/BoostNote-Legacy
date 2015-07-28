var React = require('react/addons')
var ReactRouter = require('react-router')
var CodeEditor = require('./CodeEditor')
var Catalyst = require('../Mixins/Catalyst')
var Markdown = require('../Mixins/Markdown')
var Select = require('react-select')
var request = require('superagent')
var PlanetActions = require('../Actions/PlanetActions')

var apiUrl = require('../../../config').apiUrl

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
          complete: true
      })
    })
}

var BlueprintForm = React.createClass({
  mixins: [Catalyst.LinkedStateMixin, ReactRouter.State, Markdown],
  propTypes: {
    close: React.PropTypes.func,
    blueprint: React.PropTypes.object
  },
  statics: {
    EDIT_MODE: 0,
    PREVIEW_MODE: 1
  },
  getInitialState: function () {
    var blueprint = Object.assign({
      title: '',
      content: '',
      Tags: []
    }, this.props.blueprint)
    blueprint.Tags = blueprint.Tags.map(function (tag) {
      return {
        label: tag.name,
        value: tag.name
      }
    })
    return {
      blueprint: blueprint,
      mode: BlueprintForm.EDIT_MODE
    }
  },
  componentDidMount: function () {
    React.findDOMNode(this.refs.title).focus()
  },
  handleTagsChange: function (selected, all) {
    var blueprint = this.state.blueprint
    blueprint.Tags = all
    this.setState({blueprint: blueprint})
  },
  handleContentChange: function (e, value) {
    var blueprint = this.state.blueprint
    blueprint.content = value
    this.setState({blueprint: blueprint})
  },
  togglePreview: function () {
    this.setState({mode: this.state.mode === BlueprintForm.EDIT_MODE ? BlueprintForm.PREVIEW_MODE : BlueprintForm.EDIT_MODE})
  },
  submit: function () {
    console.log(this.state.blueprint)
    var blueprint = Object.assign({}, this.state.blueprint)
    blueprint.Tags = blueprint.Tags.map(function (tag) {
      return tag.value
    })
    if (this.props.blueprint == null) {
      var params = this.getParams()
      var userName = params.userName
      var planetName = params.planetName

      PlanetActions.createBlueprint(userName + '/' + planetName, blueprint)
    } else {
      var blueprintId = blueprint.id
      delete blueprint.id

      PlanetActions.updateBlueprint(blueprintId, blueprint)
    }
  },
  handleKeyDown: function (e) {
    if (e.keyCode === 13 && e.metaKey) {
      this.submit()
      e.stopPropagation()
    }
  },
  render: function () {
    var content = this.state.mode === BlueprintForm.EDIT_MODE ? (
      <div className='form-group'>
        <CodeEditor onChange={this.handleContentChange} code={this.state.blueprint.content} mode={'markdown'}/>
      </div>
    ) : (
      <div className='form-group relative'>
        <div className='previewMode'>Preview mode</div>
        <div className='marked' dangerouslySetInnerHTML={{__html: ' ' + this.markdown(this.state.blueprint.content)}}></div>
      </div>
    )

    return (
      <div onKeyDown={this.handleKeyDown} className='BlueprintForm'>
        <div className='modal-body'>
          <div className='form-group'>
            <input ref='title' className='block-input' valueLink={this.linkState('blueprint.title')} placeholder='Title'/>
          </div>
          {content}
          <div className='form-group'>
            <Select
                name='Tags'
                multi={true}
                allowCreate={true}
                value={this.state.blueprint.Tags}
                placeholder='Tags...'
                asyncOptions={getOptions}
                onChange={this.handleTagsChange}
            />
          </div>
        </div>

        <div className='modal-footer'>
            <button onClick={this.togglePreview} className='btn-default'>Toggle Preview</button>
          <div className='modal-control'>
            <button onClick={this.props.close} className='btn-default'>Cancel</button>
            <button onClick={this.submit} className='btn-primary'>Launch</button>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = BlueprintForm
