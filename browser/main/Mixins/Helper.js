function deleteItemFromTargetArray (item, targetArray) {
  if (targetArray == null) targetArray = []
  targetArray.some(function (_item, index) {
    if (_item.id === item.id) {
      targetArray.splice(index, 1)
      return true
    }
    return false
  })

  return targetArray
}

function updateItemToTargetArray (item, targetArray) {
  if (targetArray == null) targetArray = []

  var isNew = !targetArray.some(function (_item, index) {
    if (_item.id === item.id) {
      targetArray.splice(index, 1, item)
      return true
    }
    return false
  })

  if (isNew) targetArray.push(item)

  return targetArray
}

module.exports = {
  deleteItemFromTargetArray: deleteItemFromTargetArray,
  updateItemToTargetArray: updateItemToTargetArray
}
