var Reflux = require('reflux')

var state = {

}

var keyDown = Reflux.createAction()

var KeyStore = Reflux.createStore({
  init: function () {
    this.listenTo(keyDown, this.onKeyDown)
    document.addEventListener('keydown', function (e) {
      keyDown(e)
    })
  },
  setState: function (newState, cb) {
    for (var key in newState) {
      state[key] = newState[key]
    }
    if (typeof cb === 'function') cb()
  },
  onKeyDown: function (e) {
    console.log(e.keyCode)
    console.log(state)

    /*
      Modals
    */

    if (state.codeForm || state.noteForm || state.noteDeleteModal || state.codeDeleteModal || state.addMemberModal || state.aboutModal || state.editProfileModal || state.contactModal || state.teamCreateModal || state.planetCreateModal || state.planetSettingModal || state.teamSettingsModal || state.logoutModal) {
      // ESC
      if (e.keyCode === 27) this.cast('closeModal')

      // Cmd + Enter
      if (e.keyCode === 13 && e.metaKey) {
        if (state.codeForm) this.cast('submitCodeForm')
        if (state.noteForm) this.cast('submitNoteForm')
        if (state.codeDeleteModal) this.cast('submitCodeDeleteModal')
        if (state.noteDeleteModal) this.cast('submitNoteDeleteModal')
        if (state.addMemberModal) this.cast('submitAddMemberModal')
        if (state.contactModal) this.cast('submitContactModal')
        if (state.teamCreateModal) this.cast('submitTeamCreateModal')
        if (state.planetCreateModal) this.cast('submitPlanetCreateModal')
        if (state.logoutModal) this.cast('submitLogoutModal')
      }

      return
    }

    /*
      PlanetContainer
    */
    if (state.planetContainer) {
      // Cmd + Enter, A
      if ((e.keyCode === 13 && e.metaKey) || e.keyCode === 65) this.cast('openLaunchModal')

      // Esc
      if (e.keyCode === 27) this.cast('toggleFocusSearchInput')

      // Up
      if (e.keyCode === 38) this.cast('selectPriorArticle')

      // Down
      if (e.keyCode === 40) this.cast('selectNextArticle')

      // E
      if (e.keyCode === 69) this.cast('openEditModal')

      // D
      if (e.keyCode === 68) this.cast('openDeleteModal')
    }

    /*
      HomeContainer
    */
    if (state.homeContainer) {
      if (e.keyCode > 48 && e.keyCode < 58 && e.metaKey) {
        this.cast('switchPlanet', e.keyCode - 48)
      }
    }
  },
  cast: function (status, data) {
    this.trigger({
      status: status,
      data: data
    })
  }
})

module.exports = function (stateKey) {
  return {
    mixins: [Reflux.listenTo(KeyStore, 'onKeyCast')],
    componentDidMount: function () {
      var newState = {}
      newState[stateKey] = true
      KeyStore.setState(newState)
    },
    componentWillUnmount: function () {
      var newState = {}
      newState[stateKey] = false
      KeyStore.setState(newState)
    }
  }
}
