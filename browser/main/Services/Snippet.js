var Snippet = {}

var snippets = {
  testcat: [
    {
      id: 1,
      callSign: 'alert',
      description: 'yolo',
      content: '<div></div>',
      mode: 'html',
      createdAt: '2015-06-26T15:10:59.000Z',
      updatedAt: '2015-06-26T15:10:59.000Z',
      UserId: 1,
      Tags: [{'id': 18, 'name': 'bootstrap', 'color': null}, {'id': 19, 'name': 'alert', 'color': null}]
    },
    {
      id: 2,
      callSign: 'log',
      description: 'javascript log',
      content: 'console.log(\'yolo\')',
      mode: 'js',
      createdAt: '2015-06-26T15:10:59.000Z',
      updatedAt: '2015-06-26T15:10:59.000Z',
      UserId: 1,
      Tags: [{'id': 20, 'name': 'log', 'color': null}, {'id': 1, 'name': 'js', 'color': null}]
    }
  ],
  group1: [],
  group2: []
}

Snippet.getByPlanet = function (planetName) {
  return new Promise(function (resolve, reject) {
    resolve(snippets[planetName])
  })
}

module.exports = Snippet
