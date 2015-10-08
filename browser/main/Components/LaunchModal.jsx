var React = require('react')

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
    var codeButton = React.findDOMNode(this.refs.codeButton)
    codeButton.addEventListener('keydown', this.handleKeyDown)
    React.findDOMNode(this.refs.noteButton).addEventListener('keydown', this.handleKeyDown)
    codeButton.focus()
  },
  componentWillUnmount: function () {
    React.findDOMNode(this.refs.codeButton).removeEventListener('keydown', this.handleKeyDown)
    React.findDOMNode(this.refs.noteButton).removeEventListener('keydown', this.handleKeyDown)
  },
  handleKeyDown: function (e) {
    if (e.keyCode === 37 && e.metaKey) {
      this.selectCodeTab()
      e.stopPropagation()
      return
    }
    if (e.keyCode === 39 && e.metaKey) {
      this.selectNoteTab()
      e.stopPropagation()
      return
    }
    if (e.keyCode === 9) {
      if (this.state.currentTab === 'code') React.findDOMNode(this.refs.form.refs.description).focus()
      else React.findDOMNode(this.refs.form.refs.title).focus()

      e.preventDefault()
    }
  },
  selectCodeTab: function () {
    this.setState({currentTab: 'code'}, function () {
      React.findDOMNode(this.refs.codeButton).focus()
    })
  },
  selectNoteTab: function () {
    this.setState({currentTab: 'note'}, function () {
      React.findDOMNode(this.refs.noteButton).focus()
    })
  },
  render: function () {
    var modalBody
    if (this.state.currentTab === 'code') {
      modalBody = (
        <CodeForm ref='form' planet={this.props.planet} transitionTo={this.props.transitionTo} close={this.props.close}/>
      )
    } else {
      modalBody = (
        <NoteForm ref='form' planet={this.props.planet} transitionTo={this.props.transitionTo} close={this.props.close}/>
      )
    }

    return (
      <div className='LaunchModal modal'>
        <div className='modal-header'>
          <div className='modal-tab'>
            <button ref='codeButton' className={this.state.currentTab === 'code' ? 'btn-primary active' : 'btn-default'} onClick={this.selectCodeTab}>Code</button>
            <button ref='noteButton' className={this.state.currentTab === 'note' ? 'btn-primary active' : 'btn-default'} onClick={this.selectNoteTab}>Note</button>
          </div>
        </div>
        {modalBody}
      </div>
    )
  }
})
