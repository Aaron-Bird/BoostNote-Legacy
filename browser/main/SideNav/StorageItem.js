import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './StorageItem.styl'
import { hashHistory } from 'react-router'

class StorageItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isOpen: true
    }
  }

  handleToggleButtonClick (e) {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  handleHeaderInfoClick (e) {
    let { storage } = this.props
    hashHistory.push('/storages/' + storage.key)
  }

  handleFolderButtonClick (folderKey) {
    return (e) => {
      let { storage } = this.props
      hashHistory.push('/storages/' + storage.key + '/folders/' + folderKey)
    }
  }

  render () {
    let { storage, location, isFolded } = this.props
    let folderList = storage.folders.map((folder) => {
      let isActive = location.pathname.match(new RegExp('\/storages\/' + storage.key + '\/folders\/' + folder.key))
      return <button styleName={isActive
          ? 'folderList-item--active'
          : 'folderList-item'
        }
        key={folder.key}
        onClick={(e) => this.handleFolderButtonClick(folder.key)(e)}
      >
        <span styleName='folderList-item-name'
          style={{borderColor: folder.color}}
        >
          {isFolded ? folder.name.substring(0, 1) : folder.name}
        </span>
        {isFolded &&
          <span styleName='folderList-item-tooltip'>
            {folder.name}
          </span>
        }
      </button>
    })

    let isActive = location.pathname.match(new RegExp('\/storages\/' + storage.key + '$'))

    return (
      <div styleName={isFolded ? 'root--folded' : 'root'}
        key={storage.key}
      >
        <div styleName={isActive
              ? 'header--active'
              : 'header'
            }>
          <button styleName='header-toggleButton'
            onMouseDown={(e) => this.handleToggleButtonClick(e)}
          >
            <i className={this.state.isOpen
                ? 'fa fa-caret-down'
                : 'fa fa-caret-right'
              }
            />
          </button>
          <button styleName='header-info'
            onClick={(e) => this.handleHeaderInfoClick(e)}
          >
            <span styleName='header-info-name'>
              {isFolded ? storage.name.substring(0, 1) : storage.name}
            </span>
            <span styleName='header-info-path'>
              ({storage.path})
            </span>
            {isFolded &&
              <span styleName='header-info--folded-tooltip'>
                {storage.name}
                <span styleName='header-info--folded-tooltip-path'>
                  ({storage.path})
                </span>
              </span>
            }
          </button>
        </div>
        {this.state.isOpen &&
          <div styleName='folderList' >
            {folderList}
          </div>
        }
      </div>
    )
  }
}

StorageItem.propTypes = {
  isFolded: PropTypes.bool
}

export default CSSModules(StorageItem, styles)
