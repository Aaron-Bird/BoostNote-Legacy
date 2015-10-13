import React, { PropTypes } from 'react'
import ExternalLink from 'boost/components/ExternalLink'

const ArticleTopBar = React.createClass({
  render () {
    return (
      <div className='ArticleTopBar'>
        <div className='left'>
          <div className='search'>
            <i className='fa fa-search fa-fw' />
            <input placeholder='Search' type='text'/>
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
})

export default ArticleTopBar
