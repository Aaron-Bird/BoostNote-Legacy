import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './StorageSection.styl'

class StorageSection extends React.Component {
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
  handleHeaderClick (e) {
    let { storage } = this.props
    this.props.handleStorageButtonClick(e, storage.key)
  }

  handleFolderClick (e, folder) {
    let { storage } = this.props
    this.props.handleFolderButtonClick(e, storage.key, folder.key)
  }

  render () {
    let { storage, filter } = this.props
    let folderList = storage.folders
      .map((folder) => {
        return (
          <button styleName={filter.type === 'FOLDER' && filter.folder === folder.key && filter.storage === storage.key
              ? 'folderList-item--active'
              : 'folderList-item'
            }
            style={{borderColor: folder.color}}
            key={folder.key}
            onClick={(e) => this.handleFolderClick(e, folder)}
          >
            {folder.name}
          </button>
        )
      })
    return (
      <div styleName='root'>
        <div styleName='header'>
          <button styleName='header-toggleButton'
            onClick={(e) => this.handleToggleButtonClick(e)}
          >
            <i className={this.state.isOpen
                ? 'fa fa-caret-down'
                : 'fa fa-caret-right'
              }
            />
          </button>
          <button styleName={filter.type === 'STORAGE' && filter.storage === storage.key
              ? 'header-name--active'
              : 'header-name'
            }
            onClick={(e) => this.handleHeaderClick(e)}
          >{storage.name}</button>
        </div>
        {this.state.isOpen &&
          <div styleName='folderList'>
            {folderList}
          </div>
        }
      </div>
    )
  }
}

StorageSection.propTypes = {
}

export default CSSModules(StorageSection, styles)
