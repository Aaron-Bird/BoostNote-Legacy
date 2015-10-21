import React, { PropTypes } from 'react'
import store from '../store'
import { setTagFilter } from '../actions'

export default class TagLink extends React.Component {
  handleClick (e) {
    store.dispatch(setTagFilter(this.props.tag.name))
  }
  render () {
    return (
      <a onClick={e => this.handleClick(e)}>{this.props.tag.name}</a>
    )
  }
}

TagLink.propTypes = {
  tag: PropTypes.shape({
    name: PropTypes.string
  })
}
