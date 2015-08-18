var remote = require('remote')
var version = remote.getGlobal('version')

var React = require('react/addons')

var ExternalLink = require('../Mixins/ExternalLink')

module.exports = React.createClass({
  mixins: [ExternalLink],
  propTypes: {
    close: React.PropTypes.func
  },
  render: function () {
    return (
      <div className='AboutModal modal'>
        <div className='about1'>
          <img className='logo' src='resources/favicon-230x230.png'/>
          <div className='appInfo'>Boost {version == null ? 'DEV version' : 'v' + version}</div>
        </div>

        <div className='about2'>
          <div className='externalLabel'>External links</div>
          <ul className='externalList'>
            <li><a onClick={this.openExternal} href='http://b00st.io'>Boost Homepage <i className='fa fa-external-link'/></a></li>
            <li><a>Regulation <i className='fa fa-external-link'/></a></li>
            <li><a>Private policy <i className='fa fa-external-link'/></a></li>
          </ul>
        </div>
      </div>
    )
  }
})
