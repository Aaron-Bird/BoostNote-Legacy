function isFinderCalled () {
  var argv = process.argv.slice(1)
  return argv.some(arg => arg.match(/--finder/))
}

if (isFinderCalled()) {
  require('./finder.js')
} else {
  require('./main.js')
}
