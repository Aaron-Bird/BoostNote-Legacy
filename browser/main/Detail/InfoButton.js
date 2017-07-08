import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './InfoButton.styl'

const InfoButton = ({
  onClick
}) => (
  <button styleName='control-infoButton'
    onClick={(e) => onClick(e)}
  >
    <i className='fa fa-info-circle infoButton' styleName='info-button' />
  </button>
)

InfoButton.propTypes = {
}

export default CSSModules(InfoButton, styles)
