var React = require('react')

var Markdown = require('../Mixins/Markdown')
var ExternalLink = require('../Mixins/ExternalLink')

module.exports = React.createClass({
  mixins: [Markdown, ExternalLink],
  propTypes: {
    className: React.PropTypes.string,
    content: React.PropTypes.string
  },
  componentDidMount: function () {
    this.addListener()
  },
  componentDidUpdate: function () {
    this.addListener()
  },
  componentWillUnmount: function () {
    this.removeListener()
  },
  componentWillUpdate: function () {
    this.removeListener()
  },
  addListener: function () {
    var anchors = React.findDOMNode(this).querySelectorAll('a')

    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', this.openExternal)
    }
  },
  removeListener: function () {
    var anchors = React.findDOMNode(this).querySelectorAll('a')

    for (var i = 0; i < anchors.length; i++) {
      anchors[i].removeEventListener('click', this.openExternal)
    }
  },
  render: function () {
    return (
      <div className={'MarkdownPreview' + (this.props.className != null ? ' ' + this.props.className : '')} dangerouslySetInnerHTML={{__html: ' ' + this.markdown(this.props.content)}}/>
    )
  }
})
