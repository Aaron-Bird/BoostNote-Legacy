import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './FolderList.styl'
import FolderItem from './FolderItem'

class FolderList extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { storage, hostBoundingBox } = this.props

    let folderList = storage.folders.map((folder) => {
      return <FolderItem key={folder.key}
        folder={folder}
        storage={storage}
        hostBoundingBox={hostBoundingBox}
      />
    })

    return (
      <div styleName='folderList'>
        {folderList.length > 0
          ? folderList
          : <div styleName='folderList-empty'>No Folders</div>
        }
      </div>
    )
  }
}

FolderList.propTypes = {
  hostBoundingBox: PropTypes.shape({
    bottom: PropTypes.number,
    height: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
    top: PropTypes.number,
    width: PropTypes.number
  }),
  storage: PropTypes.shape({
    key: PropTypes.string
  }),
  folder: PropTypes.shape({
    key: PropTypes.string,
    color: PropTypes.string,
    name: PropTypes.string
  })
}

export default CSSModules(FolderList, styles)
