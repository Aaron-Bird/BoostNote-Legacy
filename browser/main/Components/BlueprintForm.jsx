var React = require('react/addons')
var ReactRouter = require('react-router')
var CodeEditor = require('./CodeEditor')
var Catalyst = require('../Mixins/Catalyst')
var Markdown = require('../Mixins/Markdown')
var Select = require('react-select')
var request = require('superagent')

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
          complete: true
      })
    })
}

var BlueprintForm = React.createClass({
  mixins: [Catalyst.LinkedStateMixin, ReactRouter.State, Markdown],
  statics: {
    EDIT_MODE: 0,
    PREVIEW_MODE: 1
  },
  propTypes: {
    close: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      blueprint: {
        title: '',
        content: '',
        Tags: []
      },
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
  },
  render: function () {
    var content = this.state.mode === BlueprintForm.EDIT_MODE ? (
      <div className='form-group'>
        <CodeEditor onChange={this.handleContentChange} code={this.state.blueprint.content} mode={'markdown'}/>
      </div>
    ) : (
      <div className='form-group'>
        <div className='previewMode'>Preview mode</div>
        <div className='marked' dangerouslySetInnerHTML={{__html: ' ' + this.markdown(this.state.blueprint.content)}}></div>
      </div>
    )

    return (
      <div className='BlueprintForm'>
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
            <button onClick={this.props.close} className='btn-default'>Cancle</button>
            <button onClick={this.submit} className='btn-primary'>Launch</button>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = BlueprintForm
