import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ModeIcon from 'browser/components/ModeIcon'
import { selectArticle } from './actions'

export default class FinderList extends React.Component {
  componentDidUpdate () {
    var index = this.props.articles.indexOf(this.props.activeArticle)
    var el = ReactDOM.findDOMNode(this)
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
  }

  handleArticleClick (article) {
    return (e) => {
      let { dispatch } = this.props
      dispatch(selectArticle(article.key))
    }
  }

  render () {
    let articleElements = this.props.articles.map(function (article) {
      if (article == null) {
        return (
          <li className={isActive ? 'active' : ''}>
            <div className='articleItem'>Undefined</div>
            <div className='divider'/>
          </li>
        )
      }

      var isActive = this.props.activeArticle != null && (article.key === this.props.activeArticle.key)
      return (
        <li key={'article-' + article.key} onClick={this.handleArticleClick(article)} className={isActive ? 'active' : ''}>
          <div className='articleItem'>
            <ModeIcon mode={article.mode}/> {article.title}</div>
          <div className='divider'/>
        </li>
      )
    }.bind(this))

    return (
      <div className='FinderList'>
        <ul>
          {articleElements}
        </ul>
      </div>
    )
  }
}

FinderList.propTypes = {
  articles: PropTypes.array,
  activeArticle: PropTypes.shape({
    type: PropTypes.string,
    key: PropTypes.string
  }),
  dispatch: PropTypes.func
}
