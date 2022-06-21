import PropTypes from 'prop-types'
import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import dataApi from 'browser/main/lib/dataApi'
import styles from './FolderList.styl'
import { store } from 'browser/main/store'
import FolderItem from './FolderItem'
import i18n from 'browser/lib/i18n'
import {
  SortableTree,
  TreeNodeLine
} from 'browser/lib/react-sortable-tree-list'
import {
  toSortableTreeData,
  toStorageFoldersData
} from 'browser/lib/sortableTreeDataTransform'

class FolderList extends React.Component {
  render() {
    const { storage, hostBoundingBox } = this.props
    return (
      <div>
        {storage.folders.length > 0 ? (
          <SortableTree
            expandAll
            nodeList={toSortableTreeData(storage.folders)}
            onChange={nodeList => {
              dataApi
                .updateFolders(storage.key, toStorageFoldersData(nodeList))
                .then(data => {
                  store.dispatch({
                    type: 'REORDER_FOLDER',
                    storage: data.storage
                  })
                })
            }}
          >
            {TreeNodeLine(props => {
              const { node: folder, updateComponent, nodeList, index } = props
              return (
                <FolderItem
                  key={folder.key}
                  folder={folder}
                  storage={storage}
                  index={index}
                  hostBoundingBox={hostBoundingBox}
                />
              )
            })}
          </SortableTree>
        ) : (
          <div styleName='folderList-empty'>{i18n.__('No Folders')}</div>
        )}
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
  render() {
    const StyledFolderList = CSSModules(FolderList, this.props.styles)
    return <StyledFolderList {...this.props} />
  }
}

export default CSSModules(SortableFolderListComponent, styles)
