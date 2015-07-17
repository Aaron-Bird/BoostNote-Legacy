var React = require('react/addons')

var ace = require('ace')
var CodeEditor = React.createClass({
  propTypes: {
    code: React.PropTypes.string,
    mode: React.PropTypes.string,
    onChange: React.PropTypes.func
  },
  componentDidMount: function () {
    var el = React.findDOMNode(this.refs.target)
    var editor = ace.edit(el)
    editor.$blockScrolling = Infinity
    editor.setValue(this.props.code)
    editor.renderer.setShowGutter(true)
    editor.setTheme('ace/theme/xcode')
    editor.clearSelection()

    var session = editor.getSession()
    session.setMode('ace/mode/' + this.props.mode)
    session.setUseSoftTabs(true)
    session.setOption('useWorker', false)
    session.setUseWrapMode(true)

    session.on('change', function (e) {
      if (this.props.onChange != null) {
        var value = editor.getValue()
        this.props.onChange(e, value)
      }
    }.bind(this))

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

module.exports = CodeEditor
