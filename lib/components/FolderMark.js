import React, { PropTypes } from 'react'

const BLUE = '#3460C7'
const LIGHTBLUE = '#2BA5F7'
const ORANGE = '#FF8E00'
const YELLOW = '#EAEF31'
const GREEN = '#02FF26'
const DARKGREEN = '#008A59'
const RED = '#E10051'
const PURPLE = '#B013A4'

function getColorByIndex (index) {
  switch (index % 8) {
    case 0:
      return LIGHTBLUE
    case 1:
      return ORANGE
    case 2:
      return RED
    case 3:
      return GREEN
    case 4:
      return DARKGREEN
    case 5:
      return YELLOW
    case 6:
      return BLUE
    case 7:
      return PURPLE
    default:
      return 'gray'
  }
}

export default class FolderMark extends React.Component {
  render () {
    let color = getColorByIndex(this.props.color)
    return (
      <i className='fa fa-square fa-fw' style={{color: color}}/>
    )
  }
}

FolderMark.propTypes = {
  color: PropTypes.number
}
