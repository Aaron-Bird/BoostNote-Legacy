var Reflux = require('reflux')

module.exports = Reflux.createActions([
  'createPlanet',
  'fetchPlanet',

  'createSnippet',
  'updateSnippet',
  'deleteSnippet',

  'createBlueprint',
  'updateBlueprint',
  'deleteBlueprint'
])
