import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ExternalLink from 'boost/components/ExternalLink'
import { setSearchFilter, clearSearch } from 'boost/actions'
import { openModal } from 'boost/modal'
import Tutorial from 'boost/components/modal/Tutorial'

export default class ArticleTopBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isTooltipHidden: true
    }
  }

  componentDidMount () {
    this.searchInput = ReactDOM.findDOMNode(this.refs.searchInput)
  }

  componentWillUnmount () {
    this.searchInput.removeEventListener('keydown', this.showTooltip)
    this.searchInput.removeEventListener('focus', this.showTooltip)
    this.searchInput.removeEventListener('blur', this.showTooltip)
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

  handleTutorialButtonClick (e) {
    openModal(Tutorial)
  }

  render () {
    return (
      <div className='ArticleTopBar'>
        <div className='left'>
          <div className='search'>
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
              - Search by tag : #{'{string}'}<br/>
              - Search by folder : in:{'{folder_name}'}
            </div>
          </div>
        </div>
        <div className='right'>
          <button onClick={e => this.handleTutorialButtonClick(e)}>?<span className='tooltip'>How to use</span></button>
          <ExternalLink className='logo' href='http://b00st.io'>
            <img src='../../resources/favicon-230x230.png' width='44' height='44'/>
            <span className='tooltip'>Boost official page</span>
          </ExternalLink>
        </div>
      </div>
    )
  }
}

ArticleTopBar.propTypes = {
  search: PropTypes.string,
  dispatch: PropTypes.func,
  status: PropTypes.shape({
    search: PropTypes.string
  })
}
