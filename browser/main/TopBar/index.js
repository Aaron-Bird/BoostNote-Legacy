import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import CSSModules from 'browser/lib/CSSModules'
import styles from './TopBar.styl'
import activityRecord from 'browser/lib/activityRecord'

const OSX = window.process.platform === 'darwin'

class TopBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      search: ''
    }
  }

  isInputFocused () {
    return document.activeElement === this.refs.searchInput
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
  }

  handleLinksButton (e) {

  }

  render () {
    let { config } = this.props
    return (
      <div className='TopBar'
        styleName={config.isSideNavFolded ? 'root--expanded' : 'root'}
      >
        <div styleName='left'>
          <div styleName='left-search'>
            <i styleName='left-search-icon' className='fa fa-search fa-fw'/>
            <input styleName='left-search-input'
              ref='searchInput'
              onFocus={(e) => this.handleSearchChange(e)}
              onBlur={(e) => this.handleSearchChange(e)}
              value={this.state.search}
              onChange={(e) => this.handleSearchChange(e)}
              placeholder='Search'
              type='text'
            />
            {this.state.search > 0 &&
              <button styleName='left-search-clearButton'
                onClick={(e) => this.handleSearchClearButton(e)}
              >
                <i className='fa fa-times'/>
              </button>
            }
          </div>

          <div styleName='left-control'>
            <button styleName='left-control-newPostButton'
              onClick={(e) => this.handleNewPostButtonClick(e)}>
              <i className='fa fa-plus'/>
              <span styleName='left-control-newPostButton-tooltip'>
                New Post {OSX ? '⌘' : '^'} + n
              </span>
            </button>
          </div>
        </div>

        <div styleName='right'>
          <button styleName='right-helpButton'
            onClick={(e) => this.handleTutorialButtonClick(e)}
            disabled
          >
            ?<span styleName='left-control-newPostButton-tooltip'>How to use</span>
          </button>
          <button styleName='right-linksButton'
            onClick={(e) => this.handleLinksButton(e)}
          >
            <img src='../resources/app.png' width='44' height='44'/>
          </button>
        </div>
      </div>
    )
  }
}

TopBar.propTypes = {
  dispatch: PropTypes.func,
  config: PropTypes.shape({
    isSideNavFolded: PropTypes.bool
  })
}

export default connect((x) => x)(CSSModules(TopBar, styles))
