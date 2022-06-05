export function toSortableTreeData(folders) {
  const folderMap = new Map()
  folders.forEach(item => {
    if (typeof item === 'object') {
      folderMap.set(item.key, item)
    }
  })

  const treeNodeList = _toSortableTreeData(
    folders.filter(item => item && !item.parent),
    folderMap
  )
  return treeNodeList
}

function _toSortableTreeData(folders, folderMap, parent) {
  if (!Array.isArray(folders)) throw new Error('folders must be an Array')
  if (!folderMap) {
    folderMap = new Map()
    folders.forEach(item => {
      if (typeof item === 'object') {
        folderMap.set(item.key, item)
      }
    })
  }

  const nodes = []
  for (const item of folders) {
    if (!item) continue

    const node = Object.assign({}, item)
    // if (parent) node.parent = parent;
    if (Array.isArray(item.children)) {
      node.children = _toSortableTreeData(
        item.children.map(itemKey => folderMap.get(itemKey)),
        folderMap,
        node
      )
    }

    nodes.push(node)
  }
  return nodes
}

export function toStorageFoldersData(nodes) {
  const folders = []
  nodes.forEach(i => delete i.parent)
  _toStorageFoldersData(nodes, folders)
  return folders
}

function _toStorageFoldersData(nodes, folders) {
  const cacheList = [...nodes]
  while (cacheList.length) {
    const node = cacheList.shift()
    if (!node) continue

    const optionItem = {
      children: []
    }
    Object.entries(node).map(([key, value]) => {
      if (key === 'children' && Array.isArray(value)) {
        value.forEach(child => {
          child.parent = node.key
          cacheList.push(child)
          optionItem.children.push(child.key)
        })
      } else {
        optionItem[key] = value
      }
    })
    folders.push(optionItem)
  }
  return folders
}
