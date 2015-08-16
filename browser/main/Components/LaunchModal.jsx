var React = require('react/addons')

var CodeForm = require('./CodeForm')
var NoteForm = require('./NoteForm')

module.exports = React.createClass({
  propTypes: {
    planet: React.PropTypes.object,
    transitionTo: React.PropTypes.func,
    close: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      currentTab: 'code'
    }
  },
  componentDidMount: function () {

  },
  stopPropagation: function (e) {
    e.stopPropagation()
  },
  selectCodeTab: function () {
    this.setState({currentTab: 'code'})
  },
  selectNoteTab: function () {
    this.setState({currentTab: 'note'})
  },
  handleKeyDown: function (e) {
    if (e.keyCode === 37 && e.metaKey) {
      this.selectCodeTab()
    }
    if (e.keyCode === 39 && e.metaKey) {
      this.selectNoteTab()
    }
  },
  render: function () {
    var modalBody
    if (this.state.currentTab === 'code') {
      modalBody = (
        <CodeForm planet={this.props.planet} transitionTo={this.props.transitionTo} close={this.props.close}/>
      )
    } else {
      modalBody = (
        <NoteForm planet={this.props.planet} transitionTo={this.props.transitionTo} close={this.props.close}/>
      )
    }

    return (
      <div className='LaunchModal modal'>
        <div className='modal-header'>
          <div className='modal-tab'>
            <button className={this.state.currentTab === 'code' ? 'btn-primary active' : 'btn-default'} onClick={this.selectCodeTab}>Code</button><button className={this.state.currentTab === 'note' ? 'btn-primary active' : 'btn-default'} onClick={this.selectNoteTab}>Note</button>
          </div>
        </div>
        {modalBody}
      </div>
    )
  }
})
