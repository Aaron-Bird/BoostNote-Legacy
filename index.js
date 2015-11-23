var argv = process.argv.slice(1)
if (argv.some(arg => arg.match(/--finder/))) {
  require('./finder.js')
} else {
  require('./main.js')
}
