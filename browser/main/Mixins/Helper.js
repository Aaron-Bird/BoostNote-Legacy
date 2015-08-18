function deleteItemFromTargetArray (item, targetArray) {
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
