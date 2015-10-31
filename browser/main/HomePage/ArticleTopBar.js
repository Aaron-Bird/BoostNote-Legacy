import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ExternalLink from 'boost/components/ExternalLink'
import { setSearchFilter } from 'boost/actions'

export default class ArticleTopBar extends React.Component {
  isInputFocused () {
    return document.activeElement === ReactDOM.findDOMNode(this.refs.searchInput)
  }

  focusInput () {
    ReactDOM.findDOMNode(this.refs.searchInput).focus()
  }

  blurInput () {
    ReactDOM.findDOMNode(this.refs.searchInput).blur()
  }

  handleSearchChange (e) {
    let { dispatch } = this.props

    dispatch(setSearchFilter(e.target.value))
  }

  handleSearchClearButton (e) {
    let { dispatch } = this.props

    dispatch(setSearchFilter(''))
    this.focusInput()
  }

  render () {
    return (
      <div className='ArticleTopBar'>
        <div className='left'>
          <div className='search'>
            <i className='fa fa-search fa-fw' />
            <input ref='searchInput' value={this.props.status.search} onChange={e => this.handleSearchChange(e)} placeholder='Search' type='text'/>
            {
              this.props.status.search != null && this.props.status.search.length > 0
                ? <button onClick={e => this.handleSearchClearButton(e)} className='searchClearBtn'><i className='fa fa-times'/></button>
                : null
            }
          </div>
        </div>
        <div className='right'>
          <button>?</button>
          <ExternalLink className='logo' href='http://b00st.io'>
            <img src='../../resources/favicon-230x230.png' width='44' height='44'/>
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
