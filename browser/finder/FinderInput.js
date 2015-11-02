import React, { PropTypes } from 'react'

export default class FinderInput extends React.Component {
  render () {
    return (
      <div className='FinderInput'>
        <input ref='input' value={this.props.value} onChange={this.props.handleSearchChange} type='text'/>
      </div>
    )
  }
}

FinderInput.propTypes = {
  handleSearchChange: PropTypes.func,
  value: PropTypes.string
}
