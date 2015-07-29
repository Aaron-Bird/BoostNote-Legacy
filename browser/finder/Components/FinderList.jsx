var React = require('react/addons')

module.exports = React.createClass({
  propTypes: {
    articles: React.PropTypes.arrayOf,
    currentArticle: React.PropTypes.shape({
      id: React.PropTypes.number,
      type: React.PropTypes.string
    })
  },
  componentDidUpdate: function () {
    var index = this.props.articles.indexOf(this.props.currentArticle)
    var el = React.findDOMNode(this)
    var li = el.querySelectorAll('li')[index]

    if (li == null) {
      return
    }

    var overflowBelow = el.clientHeight + el.scrollTop < li.offsetTop + li.clientHeight
    if (overflowBelow) {
      el.scrollTop = li.offsetTop + li.clientHeight - el.clientHeight
    }
    var overflowAbove = el.scrollTop > li.offsetTop
    if (overflowAbove) {
      el.scrollTop = li.offsetTop
    }
  },
  render: function () {
    var list = this.props.articles.map(function (article) {
      if (article == null) {
        return (
          <li className={isActive ? 'active' : ''}>
            <div className='articleItem'>Undefined</div>
            <div className='divider'/>
          </li>
        )
      }

      var isActive = this.props.currentArticle != null && (article.type === this.props.currentArticle.type && article.id === this.props.currentArticle.id)
      if (article.type === 'snippet') {
        return (
          <li className={isActive ? 'active' : ''}>
            <div className='articleItem'><i className='fa fa-code fa-fw'/> {article.callSign} / {article.description.substring(0, 10)}</div>
            <div className='divider'/>
          </li>
        )
      }
      if (article.type === 'blueprint') {
        return (
          <li className={isActive ? 'active' : ''}>
            <div className='articleItem'><i className='fa fa-file-text-o fa-fw'/> {article.title}</div>
            <div className='divider'/>
          </li>
        )
      }
      return (
        <li className={isActive ? 'active' : ''}>
          <div className='articleItem'>Undefined</div>
          <div className='divider'/>
        </li>
      )
    }.bind(this))

    return (
      <div className='FinderList'>
        <ul>
          {list}
        </ul>
      </div>
    )
  }
})
