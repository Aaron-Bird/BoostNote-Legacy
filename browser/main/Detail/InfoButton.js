import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './InfoButton.styl'

class InfoButton extends React.Component {
  constructor (props) {
    super(props)

    this.handleInfoButtonClick = this.handleInfoButtonClick.bind(this)
  }

  handleInfoButtonClick (e) {
    e.preventDefault()
    const infoPanel= document.querySelector('.infoPanel')
    infoPanel.style.display = display === 'none' ? 'inline' : 'none'
  }

  render () {
    return (
      <button styleName='control-infoButton'
        onClick={(e) => this.handleInfoButtonClick(e)}
      >
        <i className='fa fa-info-circle infoButton' styleName='info-button' />
      </button>
    )
  }
}

InfoButton.propTypes = {
}

export default CSSModules(InfoButton, styles)
