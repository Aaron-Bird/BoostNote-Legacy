var React = require('react/addons')

var ace = require('ace')
var CodeViewer = React.createClass({
  propTypes: {
    code: React.PropTypes.string,
    mode: React.PropTypes.string
  },
  componentDidMount: function () {
    var el = React.findDOMNode(this.refs.target)
    var editor = ace.edit(el)
    editor.setValue(this.props.code)
    editor.$blockScrolling = Infinity
    editor.renderer.setShowGutter(false)
    editor.setReadOnly(true)

    var session = editor.getSession()
    session.setMode('ace/mode/' + this.props.mode)
    session.setUseSoftTabs(true)

    this.setState({editor: editor})
  },
  componentDidUpdate: function () {
    this.state.editor.setValue(this.props.code)
    this.state.editor.getSession().setMode('ace/mode/' + this.props.mode)
  },
  render: function () {
    return (
      <div ref='target'></div>
    )
  }
})

module.exports = CodeViewer
