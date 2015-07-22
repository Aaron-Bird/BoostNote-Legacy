var Reflux = require('reflux')

module.exports = Reflux.createActions([
  'createPlanet',
  'fetchPlanet',

  'changeName',
  'addUser',

  'createSnippet',
  'updateSnippet',
  'deleteSnippet',

  'createBlueprint',
  'updateBlueprint',
  'deleteBlueprint'
])
