import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ExternalLink from 'browser/components/ExternalLink'
import activityRecord from 'browser/lib/activityRecord'

const OSX = process.platform === 'darwin'

export default class ArticleTopBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isTooltipHidden: true,
      isLinksDropdownOpen: false
    }
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
