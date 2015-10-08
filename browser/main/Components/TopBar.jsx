var React = require('react')

var ExternalLink = require('../Mixins/ExternalLink')

module.exports = React.createClass({
  mixins: [ExternalLink],
  propTypes: {
    search: React.PropTypes.string,
    changeSearch: React.PropTypes.func
  },
  render: function () {
    return (
      <div className='TopBar'>
        <div className='left'>
          <div className='search'>
            <i className='fa fa-search'/>
            <input value={this.props.search} onChange={this.props.changeSearch} className='searchInput' placeholder='Search...'/>
          </div>
        </div>

        <div className='right'>
          <a onClick={this.openExternal} href='http://b00st.io' className='logo'>
            <img width='44' height='44' src='resources/favicon-230x230.png'/>
            <div className='tooltip'>Boost official page</div>
          </a>
        </div>
      </div>
    )
  }
})
