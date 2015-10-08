function updateUser (user) {
  return {
    type: 'USER_UPDATE',
    data: user
  }
}

module.exports = {
  updateUser: updateUser
}
