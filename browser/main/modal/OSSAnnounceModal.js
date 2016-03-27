import React, { PropTypes } from 'react'
import ExternalLink from 'browser/components/ExternalLink'

export default class OSSAnnounceModal extends React.Component {
  handleCloseBtnClick (e) {
    this.props.close()
  }
  render () {
    return (
      <div className='OSSAnnounceModal modal'>

        <div className='OSSAnnounceModal-title'>Boostnote has been Open-sourced</div>

        <ExternalLink className='OSSAnnounceModal-link' href='https://github.com/BoostIO/Boostnote'>
          https://github.com/BoostIO/Boostnote
        </ExternalLink>

        <button
          className='OSSAnnounceModal-closeBtn'
          onClick={(e) => this.handleCloseBtnClick(e)}
        >Close</button>
      </div>
    )
  }
}

OSSAnnounceModal.propTypes = {
  close: PropTypes.func
}
