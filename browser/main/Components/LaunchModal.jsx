var React = require('react/addons')
var ReactRouter = require('react-router')
var Catalyst = require('../Mixins/Catalyst')

var SnippetForm = require('./SnippetForm')
var BlueprintForm = require('./BlueprintForm')

var LaunchModal = React.createClass({
  mixins: [Catalyst.LinkedStateMixin, ReactRouter.State],
  propTypes: {
    close: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      currentTab: 'snippet'
    }
  },
  stopPropagation: function (e) {
    e.stopPropagation()
  },
  selectSnippetTab: function () {
    this.setState({currentTab: 'snippet'})
  },
  selectBlueprintTab: function () {
    this.setState({currentTab: 'blueprint'})
  },
  handleKeyDown: function (e) {
    if (e.keyCode === 37 && e.metaKey) {
      this.selectSnippetTab()
    }
    if (e.keyCode === 39 && e.metaKey) {
      this.selectBlueprintTab()
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
      <div onKeyDown={this.handleKeyDown} onClick={this.stopPropagation} className='LaunchModal modal'>
        <div className='modal-header'>
          <div className='modal-tab'>
            <button className={this.state.currentTab === 'snippet' ? 'btn-primary active' : 'btn-default'} onClick={this.selectSnippetTab}>Snippet</button><button className={this.state.currentTab === 'blueprint' ? 'btn-primary active' : 'btn-default'} onClick={this.selectBlueprintTab}>Blueprint</button>
          </div>
        </div>
        {modalBody}
      </div>
    )
  }
})

module.exports = LaunchModal
