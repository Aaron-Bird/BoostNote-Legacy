import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './InfoPanel.styl'

const InfoPanel = ({
  storageName, folderName, noteKey, updatedAt, createdAt, exportAsMd, exportAsTxt
}) => (
  <div className='infoPanel' styleName='control-infoButton-panel' style={{display: 'none'}}>
    <div styleName='group-section'>
      <div styleName='group-section-label'>
        Storage
      </div>
      <div styleName='group-section-control'>
        {storageName}
      </div>
    </div>
    <div styleName='group-section'>
      <div styleName='group-section-label'>
        Folder
      </div>
      <div styleName='group-section-control'>
        {folderName}
      </div>
    </div>
    <div styleName='group-section'>
      <div styleName='group-section-label'>
        Created at
      </div>
      <div styleName='group-section-control'>
        {createdAt}
      </div>
    </div>
    <div styleName='group-section'>
      <div styleName='group-section-label'>
        Updated at
      </div>
      <div styleName='group-section-control'>
        {updatedAt}
      </div>
    </div>
    <div styleName='group-section'>
      <div styleName='group-section-label'>
        Note Link
      </div>
      <div styleName='group-section-control'>
        <input value={noteLink} onClick={(e) => { e.target.select() }} />
      </div>
    </div>

    <div styleName='group-export'>
      <i className='fa fa-file-text fa-fw'
        onClick={(e) => exportAsMd(e)}
      />

      <i className='fa fa-file-text fa-fw'
        onClick={(e) => exportAsTxt(e)}
      />
    </div>
  </div>
)

InfoPanel.propTypes = {
  storageName: PropTypes.string.isRequired,
  folderName: PropTypes.string.isRequired,
  noteLink: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  exportAsMd: PropTypes.func.isRequired,
  exportAsTxt: PropTypes.func.isRequired
}

export default CSSModules(InfoPanel, styles)
