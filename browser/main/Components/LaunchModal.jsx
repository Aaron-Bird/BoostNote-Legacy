var React = require('react/addons')
var ReactRouter = require('react-router')
var Catalyst = require('../Mixins/Catalyst')
var PlanetStore = require('../Stores/PlanetStore')

var SnippetForm = require('./SnippetForm')
var BlueprintForm = require('./BlueprintForm')

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
  stopPropagation: function (e) {
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
      <div onClick={this.stopPropagation} className='modal launch-modal'>
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
