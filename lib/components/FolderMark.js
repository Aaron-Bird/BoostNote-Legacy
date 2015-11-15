import React, { PropTypes } from 'react'

const BLUE = '#3460C7'
const LIGHTBLUE = '#2BA5F7'
const ORANGE = '#FF8E00'
const YELLOW = '#E8D252'
const GREEN = '#3FD941'
const DARKGREEN = '#1FAD85'
const RED = '#E10051'
const PURPLE = '#B013A4'

function getColorByIndex (index) {
  switch (index % 8) {
    case 0:
      return RED
    case 1:
      return ORANGE
    case 2:
      return YELLOW
    case 3:
      return GREEN
    case 4:
      return DARKGREEN
    case 5:
      return LIGHTBLUE
    case 6:
      return BLUE
    case 7:
      return PURPLE
    default:
      return DARKGREEN
  }
}

export default class FolderMark extends React.Component {
  render () {
    let color = getColorByIndex(this.props.color)
    let className = 'FolderMark fa fa-square fa-fw'
    if (this.props.className != null) {
      className += ' active'
    }

    return (
      <i className={className} style={{color: color}}/>
    )
  }
}

FolderMark.propTypes = {
  color: PropTypes.number,
  className: PropTypes.string
}
