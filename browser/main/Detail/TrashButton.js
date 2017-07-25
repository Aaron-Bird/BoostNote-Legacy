import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './TrashButton.styl'

const TrashButton = ({
  onClick
}) => (
  <button styleName='control-trashButton'
    onClick={(e) => onClick(e)}
  >
    <i className='fa fa-trash trashButton' styleName='info-button' />
  </button>
)

TrashButton.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default CSSModules(TrashButton, styles)
