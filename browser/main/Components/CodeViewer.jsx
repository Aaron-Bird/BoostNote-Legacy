var React = require('react')

var ace = window.ace

module.exports = React.createClass({
  propTypes: {
    code: React.PropTypes.string,
    mode: React.PropTypes.string,
    className: React.PropTypes.string
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
    if (this.props.mode != null && this.props.mode.length > 0) {
      session.setMode('ace/mode/' + this.props.mode)
    } else {
      session.setMode('ace/mode/text')
    }
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
      var session = this.state.editor.getSession()
      if (this.props.mode != null && this.props.mode.length > 0) {
        session.setMode('ace/mode/' + this.props.mode)
      } else {
        session.setMode('ace/mode/text')
      }
    }
  },
  render: function () {
    return (
      <div ref='target' className={this.props.className}></div>
    )
  }
})
