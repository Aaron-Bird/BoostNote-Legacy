import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NoteList.styl'
import ReactDOM from 'react-dom'
import ModeIcon from 'browser/components/ModeIcon'
import moment from 'moment'
import _ from 'lodash'

const electron = require('electron')
const remote = electron.remote
const ipc = electron.ipcRenderer

class NoteList extends React.Component {
  constructor (props) {
    super(props)

    // this.focusHandler = (e) => this.focus()
  }

  componentDidMount () {
    // this.refreshTimer = setInterval(() => this.forceUpdate(), 60 * 1000)
    // ipc.on('list-focus', this.focusHandler)
    // this.focus()
  }

  componentWillUnmount () {
    // clearInterval(this.refreshTimer)
    // ipc.removeListener('list-focus', this.focusHandler)
  }

  componentDidUpdate () {
    // return false
    // var index = articles.indexOf(null)
    // var el = ReactDOM.findDOMNode(this)
    // var li = el.querySelectorAll('.NoteList>div')[index]

    // if (li == null) {
    //   return
    // }

    // var overflowBelow = el.clientHeight + el.scrollTop < li.offsetTop + li.clientHeight
    // if (overflowBelow) {
    //   el.scrollTop = li.offsetTop + li.clientHeight - el.clientHeight
    // }
    // var overflowAbove = el.scrollTop > li.offsetTop
    // if (overflowAbove) {
    //   el.scrollTop = li.offsetTop
    // }
  }

  focus () {
    // ReactDOM.findDOMNode(this).focus()
  }

  // 移動ができなかったらfalseを返す:
  selectPriorArticle () {
    let { articles, activeArticle, dispatch } = this.props
    let targetIndex = articles.indexOf(activeArticle) - 1
    let targetArticle = articles[targetIndex]
    return false
  }

  selectNextArticle () {
    let { articles, activeArticle, dispatch } = this.props
    let targetIndex = articles.indexOf(activeArticle) + 1
    let targetArticle = articles[targetIndex]

    if (targetArticle != null) {
      dispatch(switchArticle(targetArticle.key))
      return true
    }
    return false
  }

  handleArticleClick (article) {
    let { dispatch } = this.props
    return function (e) {
      dispatch(switchArticle(article.key))
    }
  }

  handleNoteListKeyDown (e) {
    if (e.metaKey || e.ctrlKey) return true

    if (e.keyCode === 65 && !e.shiftKey) {
      e.preventDefault()
      remote.getCurrentWebContents().send('top-new-post')
    }

    if (e.keyCode === 65 && e.shiftKey) {
      e.preventDefault()
      remote.getCurrentWebContents().send('nav-new-folder')
    }

    if (e.keyCode === 68) {
      e.preventDefault()
      remote.getCurrentWebContents().send('detail-delete')
    }

    if (e.keyCode === 84) {
      e.preventDefault()
      remote.getCurrentWebContents().send('detail-title')
    }

    if (e.keyCode === 69) {
      e.preventDefault()
      remote.getCurrentWebContents().send('detail-edit')
    }

    if (e.keyCode === 83) {
      e.preventDefault()
      remote.getCurrentWebContents().send('detail-save')
    }

    if (e.keyCode === 38) {
      e.preventDefault()
      this.selectPriorArticle()
    }

    if (e.keyCode === 40) {
      e.preventDefault()
      this.selectNextArticle()
    }
  }

  render () {
    let articleElements = []

    return (
      <div className='NoteList'
        styleName='root'
        tabIndex='0'
        onKeyDown={(e) => this.handleNoteListKeyDown(e)}
        style={this.props.style}
      >
        {articleElements}
      </div>
    )
  }
}

NoteList.propTypes = {
  dispatch: PropTypes.func,
  repositories: PropTypes.array,
  style: PropTypes.shape({
    width: PropTypes.number
  })
}

export default CSSModules(NoteList, styles)
