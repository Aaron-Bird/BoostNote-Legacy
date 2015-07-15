var React = require('react/addons')
var ReactRouter = require('react-router')
var CodeEditor = require('./CodeEditor')
var Catalyst = require('../Mixins/Catalyst')

var Select = require('react-select')

var PlanetActions = require('../Actions/PlanetActions')
var PlanetStore = require('../Stores/PlanetStore')

// TODO: remove
var options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' }
]

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
  handleSnippetTagsChange: function (selected, all) {
    var snippet = this.state.snippet
    snippet.Tags = all
    this.setState({snippet: snippet})
  },
  handleSnippetContentChange: function (e, value) {
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
            <textarea className='snippetDescription block-input' valueLink={this.linkState('snippet.description')} placeholder='Description'/>
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
              name='Tags'
              multi={true}
              allowCreate={true}
              value={this.state.snippet.Tags}
              placeholder='Tags...'
              options={options}
              onChange={this.handleSnippetTagsChange}
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

var BlueprintForm = React.createClass({
  mixins: [Catalyst.LinkedStateMixin, ReactRouter.State],
  propTypes: {
    close: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      blueprint: {
        title: '',
        content: '',
        Tags: []
      }
    }
  },
  handleBlueprintTagsChange: function (selected, all) {
    var blueprint = this.state.blueprint
    blueprint.Tags = all
    this.setState({blueprint: blueprint})
  },
  handleBlueprintContentChange: function (e, value) {
    var blueprint = this.state.blueprint
    blueprint.content = value
    this.setState({blueprint: blueprint})
  },
  submit: function () {
    console.log(this.state.blueprint)
  },
  render: function () {
    return (
      <div className='BlueprintForm'>
        <div className='modal-body'>
          <div className='form-group'>
            <input className='block-input' valueLink={this.linkState('blueprint.title')} placeholder='Title'/>
          </div>
          <div className='form-group'>
            <CodeEditor onChange={this.handleBlueprintContentChange} code={this.state.blueprint.content} mode={'markdown'}/>
          </div>
          <div className='form-group'>
            <Select
                name='Tags'
                multi={true}
                allowCreate={true}
                value={this.state.blueprint.Tags}
                placeholder='Tags...'
                options={options}
                onChange={this.handleBlueprintTagsChange}
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

var LaunchModal = React.createClass({
  mixins: [Catalyst.LinkedStateMixin, ReactRouter.State],
  propTypes: {
    submit: React.PropTypes.func,
    close: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      currentTab: 'snippet'
    }
  },
  componentDidMount: function () {
    this.unsubscribe = PlanetStore.listen(this.onListen)
  },
  componentWillUnmount: function () {
    this.unsubscribe()
  },
  onListen: function (res) {
    switch (res.status) {
      case 'snippetCreated':
        this.props.close()
        break
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
  submit: function () {
    // this.props.submit('yolo')
    if (this.state.currentTab === 'snippet') {
      console.log(this.state.snippet)
    } else {
      console.log(this.state.blueprint)
    }
  },
  render: function () {
    var modalBody
    if (this.state.currentTab === 'snippet') {
      modalBody = (
        <SnippetForm close={this.props.close}/>
      )
    } else {
      modalBody = (
        <BlueprintForm close={this.props.close}/>
      )
    }

    return (
      <div onClick={this.handleClick} className='modal launch-modal'>
        <div className='modal-header'>
          <div className='modal-tab form-group'>
            <button className={this.state.currentTab === 'snippet' ? 'btn-primary active' : 'btn-default'} onClick={this.selectSnippetTab}>Snippet</button><button className={this.state.currentTab === 'blueprint' ? 'btn-primary active' : 'btn-default'} onClick={this.selectBlueprintTab}>Blueprint</button>
          </div>
        </div>
        {modalBody}
      </div>
    )
  }
})

module.exports = LaunchModal
