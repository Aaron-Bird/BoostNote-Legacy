import PropTypes from 'prop-types'
import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './TocButton.styl'

const TocButton = ({ onClick }) => (
  <button
    className='tocButton'
    styleName='control-tocButton'
    onClick={e => onClick(e)}
  >
    <img className='tocButton' src='../resources/icon/icon-toc.svg' />
  </button>
)

TocButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default CSSModules(TocButton, styles)
