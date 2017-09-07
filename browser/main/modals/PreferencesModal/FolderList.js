import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './FolderList.styl'
import FolderItem from './FolderItem'
import { SortableContainer, arrayMove } from 'react-sortable-hoc'

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


class SortableFolderListComponent extends React.Component {
  constructor (props) {
    super(props)
    this.onSortEnd = ({oldIndex, newIndex}) => {
      let { storage } = this.props
      storage.folders = arrayMove(storage.folders, oldIndex, newIndex)
      this.setState()
    }
  }

  render() {

    const StyledFolderList = CSSModules(FolderList, this.props.styles)
    const SortableFolderList = SortableContainer(StyledFolderList)

    return (
      <SortableFolderList
        helperClass='sortableItemHelper'
        onSortEnd={this.onSortEnd}
        useDragHandle
        {...this.props}
      />
    )
  }
}

export default CSSModules(SortableFolderListComponent, styles)
