var Reflux = require('reflux')

module.exports = Reflux.createActions([
  'createPlanet',
  'fetchPlanet',
  'deletePlanet',

  'changeName',
  'addUser',
  'removeUser',

  'createSnippet',
  'updateSnippet',
  'deleteSnippet',

  'createBlueprint',
  'updateBlueprint',
  'deleteBlueprint'
])
