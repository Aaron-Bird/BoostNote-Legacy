var ForceUpdate = function (interval) {
  return {
    componentDidMount: function () {
      this.refreshTimer = setInterval(function () {
        this.forceUpdate()
      }.bind(this), interval)
    },
    componentWillUnmount: function () {
      clearInterval(this.refreshTimer)
    }
  }
}

module.exports = ForceUpdate
