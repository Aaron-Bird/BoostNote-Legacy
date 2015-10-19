import React, { PropTypes } from 'react'
import ExternalLink from 'boost/components/ExternalLink'
import { setSearchFilter } from 'boost/actions'

export default class ArticleTopBar extends React.Component {
  handleSearchChange (e) {
    let { dispatch } = this.props

    dispatch(setSearchFilter(e.target.value))
  }

  render () {
    return (
      <div className='ArticleTopBar'>
        <div className='left'>
          <div className='search'>
            <i className='fa fa-search fa-fw' />
            <input value={this.props.status.search} onChange={e => this.handleSearchChange(e)} placeholder='Search' type='text'/>
          </div>
          <button className='refreshBtn'><i className='fa fa-fw fa-refresh'/></button>
        </div>
        <div className='right'>
          <button>?</button>
          <button>i</button>
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
  dispatch: PropTypes.func
}
