import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './FolderList.styl'
import FolderItem from './FolderItem'
import { SortableContainer } from 'react-sortable-hoc'

class FolderList extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    let { storage, hostBoundingBox } = this.props

    let folderList = storage.folders.map((folder, index) => {
      return <FolderItem key={folder.key}
        folder={folder}
        storage={storage}
        index = {index}
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
    key: PropTypes.number,
    color: PropTypes.string,
    name: PropTypes.string
  })
}

const StyledFolderList = CSSModules(FolderList, styles)
const SortableFolderList = SortableContainer(StyledFolderList)

class SortableFolderListComponent extends React.Component {
  constructor (props) {
    super(props)
    this.onSortEnd = ({oldIndex, newIndex}) => {
      console.log("end")
    }
  }

  render() {
    return (
      <SortableFolderList onSortEnd={this.onSortEnd} {...this.props} />
    )
  }
}

export default SortableFolderListComponent
