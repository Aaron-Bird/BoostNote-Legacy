import React, { PropTypes } from 'react'

export default class TagLink extends React.Component {
  handleClick (e) {
  }
  render () {
    return (
      <a onClick={(e) => this.handleClick(e)}>{this.props.tag}</a>
    )
  }
}

TagLink.propTypes = {
  tag: PropTypes.string
}
