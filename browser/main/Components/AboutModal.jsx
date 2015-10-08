var React = require('react')

var ExternalLink = require('../Mixins/ExternalLink')
var KeyCaster = require('../Mixins/KeyCaster')

module.exports = React.createClass({
  mixins: [ExternalLink, KeyCaster('aboutModal')],
  propTypes: {
    close: React.PropTypes.func
  },
  onKeyCast: function (e) {
    switch (e.status) {
      case 'closeModal':
        this.props.close()
        break
    }
  },
  render: function () {
    var version = global.version
    return (
      <div className='PreferencesModal sideNavModal modal'>
        <div className='about1'>
          <img className='logo' src='resources/favicon-230x230.png'/>
          <div className='appInfo'>Boost {version == null || version.length === 0 ? 'DEV version' : 'v' + version}</div>
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
