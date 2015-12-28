import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ExternalLink from 'browser/components/ExternalLink'
import { setSearchFilter, clearSearch, toggleOnlyUnsavedFilter, toggleTutorial, saveAllArticles, switchArticle } from '../actions'
import store from '../store'

const electron = require('electron')
const remote = electron.remote
const Menu = remote.Menu
const MenuItem = remote.MenuItem

var menu = new Menu()
var lastIndex = -1
menu.append(new MenuItem({
  label: 'Show only unsaved',
  click: function () {
    store.dispatch(setSearchFilter('--unsaved'))
  }
}))
menu.append(new MenuItem({
  label: 'Go to an unsaved article',
  click: function () {
    lastIndex++
    let state = store.getState()
    let modified = state.articles.modified
    if (modified.length === 0) return
    if (modified.length <= lastIndex) {
      lastIndex = 0
    }
    store.dispatch(switchArticle(modified[lastIndex].key))
  }
}))

const BRAND_COLOR = '#18AF90'

const searchTutorialElement = (
  <svg width='750' height='120' className='tutorial'>
    <text x='450' y='33' fill={BRAND_COLOR} fontSize='24'>Search some posts!!</text>
    <text x='450' y='60' fill={BRAND_COLOR} fontSize='18'>{'- Search by tag : #{string}'}</text>
    <text x='450' y='85' fill={BRAND_COLOR} fontSize='18'>
    {'- Search by folder : /{folder_name}\n'}</text>
    <text x='465' y='105' fill={BRAND_COLOR} fontSize='14'>
    {'exact match : //{folder_name}'}</text>

    <svg width='500' height='300'>
      <path fill='white' d='M54.5,51.5c-12.4,3.3-27.3-1.4-38.4-7C11.2,42,5,38.1,5.6,31.8c0.7-6.9,8.1-11.2,13.8-13.7
c12.3-5.4,26.4-6.8,39.7-7.7C72.4,9.6,85.7,9.7,99,9.8c55.2,0.3,110.4,2.2,165.5-1.5C291,6.5,317.7,3.8,344.1,7
c12.8,1.6,25.8,4.4,37.5,10c1.2,0.6,2.4,1.1,3.5,1.8c2.4,1.4,3.2,1.5,3.3,4.5c0.1,3.6-2.3,5.9-4.8,8.3c-3.9,3.8-8.6,6.8-13.5,9.2
c-12.6,6-26.5,7.2-40.3,7.7c-13.7,0.5-27.5,0.6-41.2,1.1c-27.7,0.9-55.3,2.2-82.9,4c-30.8,2-61.6,4.5-92.3,7.6
c-15.4,1.5-30.8,3.7-46.3,4.9c-13.6,1.1-30.7,1.5-41.8-7.8c-1.5-1.2-3.6,0.9-2.1,2.1c8.9,7.5,21.4,9.2,32.7,9.2
c15.3,0,30.6-2.6,45.8-4.2c31.3-3.3,62.7-6,94.2-8.1c30.9-2.1,61.8-3.7,92.8-4.7c15.7-0.5,31.4-0.5,47-1.3
c13.1-0.7,26.3-2.7,38.1-8.9c4.4-2.3,8.5-5.1,12-8.6c2.8-2.8,7.3-7.3,6.4-11.7c-0.8-4.3-6.4-6.3-9.8-7.9
c-5.6-2.6-11.4-4.6-17.3-6.2c-28.3-7.5-58.1-5.6-87-3.6c-62.3,4.4-124.5,2.6-187,2.4c-16.4,0-32.8,0-49,2.4
C29.9,11,13.4,13.8,5.5,24.6c-7.3,10,0.7,18.4,9.8,22.9c11.9,5.8,26.9,10.4,40,7C57.2,53.9,56.4,51,54.5,51.5L54.5,51.5z'/>
      <path fill='white' d='M446.5,21.4c-9.1-1.6-18.1-3.5-27.4-3.5c-10.2,0-20.4,1.4-30.5,2.8c-1.9,0.3-1.9,3.3,0,3
c9.5-1.3,19.1-2.6,28.8-2.7c9.6-0.2,18.9,1.7,28.3,3.4C447.6,24.7,448.4,21.8,446.5,21.4L446.5,21.4z'/>
    </svg>
  </svg>
)

export default class ArticleTopBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isTooltipHidden: true,
      isLinksDropdownOpen: false
    }
  }

  componentDidMount () {
    this.searchInput = ReactDOM.findDOMNode(this.refs.searchInput)
    this.linksButton = ReactDOM.findDOMNode(this.refs.links)
    this.showLinksDropdown = e => {
      e.preventDefault()
      e.stopPropagation()
      if (!this.state.isLinksDropdownOpen) {
        this.setState({isLinksDropdownOpen: true})
      }
    }
    this.linksButton.addEventListener('click', this.showLinksDropdown)
    this.hideLinksDropdown = e => {
      if (this.state.isLinksDropdownOpen) {
        this.setState({isLinksDropdownOpen: false})
      }
    }
    document.addEventListener('click', this.hideLinksDropdown)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.hideLinksDropdown)
    this.linksButton.removeEventListener('click', this.showLinksDropdown())
  }

  handleTooltipRequest (e) {
    if (this.searchInput.value.length === 0 && (document.activeElement === this.searchInput)) {
      this.setState({isTooltipHidden: false})
    } else {
      this.setState({isTooltipHidden: true})
    }
  }

  isInputFocused () {
    return document.activeElement === ReactDOM.findDOMNode(this.refs.searchInput)
  }

  escape () {
    let { status, dispatch } = this.props
    if (status.search.length > 0) {
      dispatch(clearSearch())
      return
    }
    this.blurInput()
  }

  focusInput () {
    this.searchInput.focus()
  }

  blurInput () {
    this.searchInput.blur()
  }

  handleSearchChange (e) {
    let { dispatch } = this.props

    dispatch(setSearchFilter(e.target.value))
    this.handleTooltipRequest()
  }

  handleSearchClearButton (e) {
    this.searchInput.value = ''
    this.focusInput()
  }

  handleOnlyUnsavedChange (e) {
    let { dispatch } = this.props

    dispatch(toggleOnlyUnsavedFilter())
  }

  handleSaveAllButtonClick (e) {
    let { dispatch } = this.props

    dispatch(saveAllArticles())
  }

  handleSaveMenuButtonClick (e) {
    menu.popup(590, 45)
  }

  handleTutorialButtonClick (e) {
    let { dispatch } = this.props

    dispatch(toggleTutorial())
  }

  render () {
    let { status, modified } = this.props
    return (
      <div className='ArticleTopBar'>
        <div className='ArticleTopBar-left'>
          <div className='ArticleTopBar-left-search'>
            <i className='fa fa-search fa-fw' />
            <input
              ref='searchInput'
              onFocus={e => this.handleSearchChange(e)}
              onBlur={e => this.handleSearchChange(e)}
              value={this.props.status.search}
              onChange={e => this.handleSearchChange(e)}
              placeholder='Search'
              type='text'
            />
            {
              this.props.status.search != null && this.props.status.search.length > 0
                ? <button onClick={e => this.handleSearchClearButton(e)} className='searchClearBtn'><i className='fa fa-times'/></button>
                : null
            }
            <div className={'tooltip' + (this.state.isTooltipHidden ? ' hide' : '')}>
              <ul>
                <li>- Search by tag : #{'{string}'}</li>
                <li>- Search by folder : /{'{folder_name}'}<br/><small>exact match : //{'{folder_name}'}</small></li>
                <li>- Only unsaved : --unsaved</li>
              </ul>
            </div>
          </div>

          {status.isTutorialOpen ? searchTutorialElement : null}

          <div className={'ArticleTopBar-left-unsaved'}>
            <button onClick={e => this.handleSaveAllButtonClick(e)} className='ArticleTopBar-left-unsaved-save-button' disabled={modified.length === 0}>
              <i className='fa fa-save'/>
              <span className={'ArticleTopBar-left-unsaved-save-button-count' + (modified.length === 0 ? ' hide' : '')} children={modified.length}/>
              <span className='ArticleTopBar-left-unsaved-save-button-tooltip' children={`Save all ${modified.length} articles (⌘ + Shift + s)`}></span>
            </button>
            <button onClick={e => this.handleSaveMenuButtonClick(e)} className='ArticleTopBar-left-unsaved-menu-button'><i className='fa fa-angle-down'/></button>
          </div>
        </div>

        <div className='ArticleTopBar-right'>
          <button onClick={e => this.handleTutorialButtonClick(e)}>?<span className='tooltip'>How to use</span>
          </button>
          <a ref='links' className='linksBtn' href>
            <img src='../resources/app.png' width='44' height='44'/>
          </a>
          {
            this.state.isLinksDropdownOpen
              ? (
                <div className='links-dropdown'>
                  <ExternalLink className='links-item' href='https://b00st.io'>
                    <i className='fa fa-fw fa-home'/>Boost official page
                  </ExternalLink>
                  <ExternalLink className='links-item' href='https://github.com/BoostIO/boost-app-discussions/issues'>
                    <i className='fa fa-fw fa-bullhorn'/> Discuss
                  </ExternalLink>
                </div>
              )
              : null
          }
        </div>

        {status.isTutorialOpen ? (
          <div className='tutorial'>
            <div onClick={e => this.handleTutorialButtonClick(e)} className='clickJammer'/>
            <svg width='500' height='250' className='finder'>
              <text x='100' y='25' fontSize='32' fill={BRAND_COLOR}>Also, you can open Finder!!</text>
              <text x='120' y='55' fontSize='18' fill={BRAND_COLOR}>with pressing `Control` + `shift` + `tab`</text>
            </svg>
            <svg width='450' className='global'>
              <text x='100' y='45' fontSize='24' fill={BRAND_COLOR}>Hope you to enjoy our app :D</text>
              <text x='50' y='75' fontSize='18' fill={BRAND_COLOR}>Press any key or click to escape tutorial mode</text>
            </svg>
            <div className='back'></div>
          </div>
        ) : null}

      </div>
    )
  }
}

ArticleTopBar.propTypes = {
  search: PropTypes.string,
  dispatch: PropTypes.func,
  status: PropTypes.shape({
    search: PropTypes.string
  }),
  modified: PropTypes.array
}
