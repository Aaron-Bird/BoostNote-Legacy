import path from 'path'
import sander from 'sander'

function parse () {
  const BOOSTNOTERC = '.boostnoterc'
  const homePath = global.process.env.HOME || global.process.env.USERPROFILE
  const boostnotercPath = path.join(homePath, BOOSTNOTERC)

  if (!sander.existsSync(boostnotercPath)) return {}
  return JSON.parse(sander.readFileSync(boostnotercPath).toString())
}

function exec (boostnotercPath) {
  const config = this.parse(boostnotercPath)
  if (config.execs === undefined) return
  _.forEach(config.execs, (exec) => {
    eval(exec)
  })
}

export default {
  parse,
  exec
}
