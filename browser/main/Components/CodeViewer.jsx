var React = require('react/addons')

var ace = window.ace
var CodeViewer = React.createClass({
  propTypes: {
    code: React.PropTypes.string,
    mode: React.PropTypes.string
  },
  componentDidMount: function () {
    var el = React.findDOMNode(this.refs.target)
    var editor = ace.edit(el)
    editor.$blockScrolling = Infinity
    editor.setValue(this.props.code)
    editor.renderer.setShowGutter(false)
    editor.setReadOnly(true)
    editor.setTheme('ace/theme/xcode')
    editor.setHighlightActiveLine(false)
    editor.clearSelection()

    var session = editor.getSession()
    session.setMode('ace/mode/' + this.props.mode)
    session.setUseSoftTabs(true)
    session.setOption('useWorker', false)
    session.setUseWrapMode(true)

    this.setState({editor: editor})
  },
  componentDidUpdate: function (prevProps) {
    if (this.state.editor.getValue() !== this.props.code) {
      this.state.editor.setValue(this.props.code)
      this.state.editor.clearSelection()
    }
    if (prevProps.mode !== this.props.mode) {
      this.state.editor.getSession().setMode('ace/mode/' + this.props.mode)
    }
  },
  render: function () {
    return (
      <div ref='target'></div>
    )
  }
})

module.exports = CodeViewer
