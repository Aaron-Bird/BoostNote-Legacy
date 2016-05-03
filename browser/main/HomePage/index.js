import React, { PropTypes} from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import SideNav from './SideNav'
import ArticleTopBar from './ArticleTopBar'
import ArticleList from './ArticleList'
import ArticleDetail from './ArticleDetail'
import { isModalOpen, closeModal } from 'browser/lib/modal'
import Repository from 'browser/lib/Repository'

const electron = require('electron')
const remote = electron.remote

const OSX = global.process.platform === 'darwin'

class HomePage extends React.Component {
  componentDidMount () {
    let { dispatch } = this.props

    // Bind directly to window
    // this.keyHandler = (e) => this.handleKeyDown(e)
    // window.addEventListener('keydown', this.keyHandler)

    // Reload all data
    Repository.loadAll()
      .then((allData) => {
        dispatch({type: 'INIT_ALL', data: allData})
      })
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.keyHandler)
  }

  handleKeyDown (e) {
    // if (isModalOpen()) {
    //   if (e.keyCode === 13 && (OSX ? e.metaKey : e.ctrlKey)) {
    //     remote.getCurrentWebContents().send('modal-confirm')
    //   }
    //   if (e.keyCode === 27) closeModal()
    //   return
    // }

    // let { dispatch } = this.props
    // let { top, list } = this.refs
    // let listElement = ReactDOM.findDOMNode(list)

    // if (status.isTutorialOpen) {
    //   // dispatch(toggleTutorial())
    //   e.preventDefault()
    //   return
    // }

    // if (e.keyCode === 13 && top.isInputFocused()) {
    //   listElement.focus()
    //   return
    // }
    // if (e.keyCode === 27 && top.isInputFocused()) {
    //   // if (status.search.length > 0) top.escape()
    //   // else listElement.focus()
    //   return
    // }

    // // Search inputがfocusされていたら大体のキー入力は無視される。
    // if (e.keyCode === 27) {
    //   if (document.activeElement !== listElement) {
    //     listElement.focus()
    //   } else {
    //     top.focusInput()
    //   }
    //   return
    // }
  }

  render () {
    return (
      <div className='HomePage'>
        <SideNav
          ref='nav'
          {...this.props}
        />
        <ArticleTopBar
          ref='top'
          {...this.props}
        />
        <ArticleList
          ref='list'
          {...this.props}
        />
        <ArticleDetail
          ref='detail'
          {...this.props}
        />
      </div>
    )
  }
}

HomePage.propTypes = {
  dispatch: PropTypes.func,
  repositories: PropTypes.array
}

export default connect((x) => x)(HomePage)
