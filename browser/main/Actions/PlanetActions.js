var Reflux = require('reflux')

module.exports = Reflux.createActions([
  'createPlanet',
  'fetchPlanet',

  'addUser',

  'createSnippet',
  'updateSnippet',
  'deleteSnippet',

  'createBlueprint',
  'updateBlueprint',
  'deleteBlueprint'
])
