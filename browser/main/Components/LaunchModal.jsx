var React = require('react/addons')
var CodeEditor = require('./CodeEditor')
var Catalyst = require('../Mixins/Catalyst')

var Select = require('react-select')

// TODO: remove
var options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' }
]

var LaunchModal = React.createClass({
  mixins: [Catalyst.LinkedStateMixin],
  propTypes: {
    submit: React.PropTypes.func,
    close: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      snippet: {
        description: '',
        mode: 'javascript',
        content: '',
        callSign: '',
        tags: []
      },
      blueprint: {
        title: '',
        content: '',
        tags: []
      },
      currentTab: 'snippet'
    }
  },
  handleClick: function (e) {
    e.stopPropagation()
  },
  selectSnippetTab: function () {
    this.setState({currentTab: 'snippet'})
  },
  selectBlueprintTab: function () {
    this.setState({currentTab: 'blueprint'})
  },
  handleSnippetTagsChange: function (selected, all) {
    var snippet = this.state.snippet
    snippet.tags = all
    this.setState({snippet: snippet})
  },
  handleSnippetContentChange: function (e, value) {
    var snippet = this.state.snippet
    snippet.content = value
    this.setState({snippet: snippet})
  },
  handleBlueprintTagsChange: function (selected, all) {
    var blueprint = this.state.blueprint
    blueprint.tags = all
    this.setState({blueprint: blueprint})
  },
  handleBlueprintContentChange: function (e, value) {
    var blueprint = this.state.blueprint
    blueprint.content = value
    this.setState({blueprint: blueprint})
  },
  submit: function () {
    // this.props.submit('yolo')
    if (this.state.currentTab === 'snippet') {
      console.log(this.state.snippet)
    } else {
      console.log(this.state.blueprint)
    }
  },
  render: function () {
    var form
    if (this.state.currentTab === 'snippet') {
      form = (
        <div>
          <div className='form-group'>
            <textarea className='block-input' valueLink={this.linkState('snippet.description')} placeholder='Description'/>
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
            <CodeEditor onChange={this.handleSnippetContentChange} code={this.state.snippet.content} mode={this.state.snippet.mode}/>
          </div>
          <div className='form-group'>
            <Select
                name='tags'
                multi={true}
                allowCreate={true}
                value={this.state.snippet.tags}
                placeholder='Tags...'
                options={options}
                onChange={this.handleSnippetTagsChange}
            />
          </div>
        </div>
      )
    } else {
      form = (
        <div>
            <div className='form-group'>
              <input className='block-input' valueLink={this.linkState('blueprint.title')} placeholder='Title'/>
            </div>
            <div className='form-group'>
              <CodeEditor onChange={this.handleBlueprintContentChange} code={this.state.blueprint.content} mode={'markdown'}/>
            </div>
            <div className='form-group'>
              <Select
                  name='tags'
                  multi={true}
                  allowCreate={true}
                  value={this.state.blueprint.tags}
                  placeholder='Tags...'
                  options={options}
                  onChange={this.handleBlueprintTagsChange}
              />
            </div>
        </div>
      )
    }

    return (
      <div onClick={this.handleClick} className='modal launch-modal'>
        <div className='modal-body'>
          <div className='modal-tab form-group'>
            <button className={this.state.currentTab === 'snippet' ? 'btn-primary active' : 'btn-default'} onClick={this.selectSnippetTab}>Snippet</button> <button className={this.state.currentTab === 'blueprint' ? 'btn-primary active' : 'btn-default'} onClick={this.selectBlueprintTab}>Blueprint</button>
          </div>
          {form}
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

module.exports = LaunchModal
