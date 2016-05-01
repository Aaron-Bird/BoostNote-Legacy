import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './Repository.styl'
import actions from 'browser/main/actions'
import RepositoryManager from 'browser/lib/RepositoryManager'

class Repository extends React.Component {
  handleUnlinkButtonClick (e) {
    let { dispatch, repository } = this.props

    RepositoryManager.removeRepo(repository)
      .then(() => {
        dispatch(actions.removeRepo(repository))
      })
  }

  render () {
    let { repository } = this.props

    let folderElements = repository.folders.map((folder) => {
      return (
        <div
          key={folder.name}
          styleName='folder'
        >
          <div styleName='folder-label'>
            <i className='fa fa-cube'/> {folder.name}
          </div>
          <div styleName='folder-control'>
            <button styleName='folder-control-button'>
              <i className='fa fa-pencil'/>
            </button>
            <button styleName='folder-control-button'>
              <i className='fa fa-trash'/>
            </button>
          </div>
        </div>
      )
    })

    return (
      <div
        className='Repository'
        styleName='root'
      >
        <div styleName='header'>
          <div styleName='header-name'>
            <i className='fa fa-archive'/> {repository.name}
          </div>

          <div styleName='header-control'>
            <button styleName='header-control-button'
              onClick={(e) => this.handleUnlinkButtonClick(e)}
            >
              <i className='fa fa-unlink'/>
            </button>
            <button styleName='header-control-button'
            >
              <i className='fa fa-pencil'/>
            </button>
            <button styleName='header-control-button'
            >
              <i className='fa fa-angle-down'/>
            </button>
          </div>
        </div>

        {folderElements}

        <button styleName='newFolderButton'
        >
          <i className='fa fa-plus'/> New Folder
        </button>
      </div>
    )
  }
}

Repository.propTypes = {
  repository: PropTypes.shape({
    name: PropTypes.string,
    folders: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string
    }))
  }),
  dispatch: PropTypes.func
}

export default CSSModules(Repository, styles)
