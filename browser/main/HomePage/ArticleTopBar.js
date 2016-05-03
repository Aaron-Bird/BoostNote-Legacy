import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ExternalLink from 'browser/components/ExternalLink'
import { isModalOpen } from 'browser/lib/modal'
import activityRecord from 'browser/lib/activityRecord'

const electron = require('electron')
const ipc = electron.ipcRenderer

const OSX = global.process.platform === 'darwin'

const BRAND_COLOR = '#18AF90'

const searchTutorialElement = (
  <svg width='750' height='300' className='tutorial'>
    <text x='125' y='63' fill={BRAND_COLOR} fontSize='24'>Search some posts!!</text>
    <text x='125' y='90' fill={BRAND_COLOR} fontSize='18'>{'- Search by tag : #{string}'}</text>
    <text x='125' y='115' fill={BRAND_COLOR} fontSize='18'>
    {'- Search by folder : /{folder_name}\n'}</text>
    <text x='140' y='135' fill={BRAND_COLOR} fontSize='14'>
    {'exact match : //{folder_name}'}</text>

    <svg x='90' width='500' height='300'>
      <path fill='white' d='M27.2,6.9c-1.7,3.5-6,4.8-8,8.2c-1.8,3.1-2.1,6.8-1.8,10.2c0.7,7,4.2,16.7,10.3,20.7c0.5,0.4,1.4,0.2,1.8-0.2
        c0.1-0.1,0.2-0.2,0.3-0.3c0.6-0.6,0.6-1.5,0-2.1c-0.2-0.2-0.3-0.4-0.5-0.5c-1.3-1.4-3.2,0.7-1.9,2.1c0.2,0.2-0.3,0.4,0.7,0.5
        c0-0.7,0-1.4,0-2.1c0,0.1-0.4,0.2-0.5,0.3c0.6-0.1,1.1-0.2,1.7-0.2c-5.7-3.7-9.2-14.5-9-20.9c0.1-4,1.6-6.7,4.8-9.1
        c2-1.5,3.6-2.6,4.7-4.9C30.6,6.7,28,5.2,27.2,6.9L27.2,6.9z'/>
      <path fill='white' d='M9.5,24.4c2.4-2.7,4.9-5.4,7.3-8c2.5-2.8,5.7-7.6,9.9-7.8c-0.5-0.5-1-1-1.5-1.5c0.1,6.8,1.9,13.1,5.3,18.9
        c1,1.7,3.6,0.2,2.6-1.5c-3.2-5.4-4.8-11.1-4.9-17.4c0-0.8-0.7-1.5-1.5-1.5c-3.6,0.2-5.9,2.1-8.3,4.7c-3.7,3.9-7.3,8-11,12
        C6.1,23.7,8.2,25.9,9.5,24.4L9.5,24.4z'/>
    </svg>
  </svg>
)

const newPostTutorialElement = (
  <svg width='900' height='900' className='tutorial'>
    <text x='470' y='50' fill={BRAND_COLOR} fontSize='24'>Create a new post!!</text>
    <text x='490' y='75' fill={BRAND_COLOR} fontSize='16' children={`press \`${OSX ? '⌘' : '^'} + n\``}/>
    <svg x='415' y='20' width='400' height='400'>
      <path fill='white' d='M11.6,14.7c1,5.5,2.9,10.7,5.7,15.5c1,1.7,3.5,0.2,2.6-1.5c-2.6-4.7-4.4-9.6-5.4-14.8
        C14.1,12,11.3,12.8,11.6,14.7L11.6,14.7z'/>
      <path fill='white' d='M16.8,17.1c4,0.2,7.6-1.1,10.7-3.6c1.5-1.2-0.6-3.3-2.1-2.1c-2.4,2-5.4,2.9-8.6,2.7C14.9,14,14.9,17,16.8,17.1
        L16.8,17.1z'/>
      <path fill='white' d='M13.8,17.6c11.9,3.5,24.1,4.9,36.4,3.9c1.9-0.1,1.9-3.1,0-3c-12.1,0.9-24-0.3-35.6-3.8
        C12.7,14.1,11.9,17,13.8,17.6L13.8,17.6z'/>
    </svg>
  </svg>
)

export default class ArticleTopBar extends React.Component {
  constructor (props) {
    super(props)

    this.saveAllHandler = e => {
      if (isModalOpen()) return true
      this.handleSaveAllButtonClick(e)
    }
    this.focusSearchHandler = e => {
      if (isModalOpen()) return true
      this.focusInput(e)
    }
    this.newPostHandler = e => {
      if (isModalOpen()) return true
      this.handleNewPostButtonClick(e)
    }

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
    // this.linksButton.addEventListener('click', this.showLinksDropdown)
    this.hideLinksDropdown = e => {
      if (this.state.isLinksDropdownOpen) {
        this.setState({isLinksDropdownOpen: false})
      }
    }
    document.addEventListener('click', this.hideLinksDropdown)

    // ipc.on('top-save-all', this.saveAllHandler)
    ipc.on('top-focus-search', this.focusSearchHandler)
    ipc.on('top-new-post', this.newPostHandler)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.hideLinksDropdown)
    this.linksButton.removeEventListener('click', this.showLinksDropdown())

    // ipc.removeListener('top-save-all', this.saveAllHandler)
    ipc.removeListener('top-focus-search', this.focusSearchHandler)
    ipc.removeListener('top-new-post', this.newPostHandler)
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
  }

  focusInput () {
    this.searchInput.focus()
  }

  blurInput () {
    this.searchInput.blur()
  }

  handleSearchChange (e) {
    let { dispatch } = this.props

    // dispatch(setSearchFilter(e.target.value))
    this.handleTooltipRequest()
  }

  handleSearchClearButton (e) {
    this.searchInput.value = ''
    this.focusInput()
  }

  handleNewPostButtonClick (e) {
    activityRecord.emit('ARTICLE_CREATE')
  }

  handleTutorialButtonClick (e) {
    let { dispatch } = this.props

    // dispatch(toggleTutorial())
  }

  render () {
    let { status } = this.props
    return (
      <div tabIndex='2' className='ArticleTopBar'>
        <div className='ArticleTopBar-left'>
          <div className='ArticleTopBar-left-search'>
            <i className='fa fa-search fa-fw' />
            <input
              ref='searchInput'
              onFocus={(e) => this.handleSearchChange(e)}
              onBlur={(e) => this.handleSearchChange(e)}
              value={'this.props.status.search'}
              onChange={(e) => this.handleSearchChange(e)}
              placeholder='Search'
              type='text'
            />
            {
              'sadf' > 0
                ? <button onClick={(e) => this.handleSearchClearButton(e)} className='ArticleTopBar-left-search-clear-button'><i className='fa fa-times'/></button>
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

          <div className={'ArticleTopBar-left-control'}>
            <button className='ArticleTopBar-left-control-new-post-button' onClick={(e) => this.handleNewPostButtonClick(e)}>
              <i className='fa fa-plus'/>
              <span className='tooltip'>New Post ({OSX ? '⌘' : '^'} + n)</span>
            </button>
          </div>
        </div>

        <div className='ArticleTopBar-right'>
          <button onClick={(e) => this.handleTutorialButtonClick(e)}>?<span className='tooltip'>How to use</span>
          </button>
          <a ref='links' className='ArticleTopBar-right-links-button' href>
            <img src='../resources/app.png' width='44' height='44'/>
          </a>
          {
            this.state.isLinksDropdownOpen
              ? (
                <div className='ArticleTopBar-right-links-button-dropdown'>
                  <ExternalLink className='ArticleTopBar-right-links-button-dropdown-item' href='https://b00st.io'>
                    <i className='fa fa-fw fa-home'/>Boost official page
                  </ExternalLink>
                  <ExternalLink className='ArticleTopBar-right-links-button-dropdown-item' href='https://github.com/BoostIO/Boostnote/issues'>
                    <i className='fa fa-fw fa-github'/> Issues
                  </ExternalLink>
                </div>
              )
              : null
          }
        </div>

        {false ? (
          <div className='tutorial'>
            <div onClick={(e) => this.handleTutorialButtonClick(e)} className='clickJammer'/>
            <svg width='500' height='250' className='finder'>
              <text x='100' y='25' fontSize='32' fill={BRAND_COLOR}>Also, you can open Finder!!</text>
              <text x='150' y='55' fontSize='18' fill={BRAND_COLOR} children={'with pressing ' + (OSX ? '`⌘ + Alt + s`' : '`Win + Alt + s`')}/>
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
  dispatch: PropTypes.func,
  status: PropTypes.shape({
    search: PropTypes.string
  }),
  folders: PropTypes.array
}
