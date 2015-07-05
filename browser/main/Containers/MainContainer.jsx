var React = require('react/addons')
var ReactRouter = require('react-router')
var RouteHandler = ReactRouter.RouteHandler

module.exports = React.createClass({
    mixins: [ReactRouter.Navigation, ReactRouter.State],
    render: function () {
      // Redirect Login state
      if (this.getPath() === '/') {
        this.transitionTo('/login')
      }
      return (
        <div className='Main'>
          <RouteHandler/>
        </div>
      )
    }
})
