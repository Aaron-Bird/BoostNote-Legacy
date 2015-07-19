var React = require('react/addons')

var PlanetNavigator = React.createClass({
  propTypes: {
    currentPlanet: React.PropTypes.shape({
      name: React.PropTypes.string
    }),
    currentUser: React.PropTypes.shape({
      name: React.PropTypes.string
    }),
    onOpenLaunchModal: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      isLaunchModalOpen: false
    }
  },
  submitLaunchModal: function (ret) {
    console.log(ret)
    this.setState({isLaunchModalOpen: false})
  },
  render: function () {
    return (
      <div className='PlanetNavigator'>
        <button onClick={this.props.onOpenLaunchModal} className='launchButton btn-primary btn-block'>
          <i className='fa fa-rocket fa-fw'/> Launch
        </button>
        <nav>
          <a>
            <i className='fa fa-home fa-fw'/> Home
          </a>
          <a>
            <i className='fa fa-code fa-fw'/> Snippets
          </a>
          <a>
            <i className='fa fa-file-text-o fa-fw'/> Blueprints
          </a>
        </nav>
      </div>
    )
  }
})

module.exports = PlanetNavigator
