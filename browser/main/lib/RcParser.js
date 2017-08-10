import path from 'path'
import sander from 'sander'

function parse () {
  const BOOSTNOTERC = '.boostnoterc'
  const homePath = global.process.env.HOME || global.process.env.USERPROFILE
  const boostnotercPath = path.join(homePath, BOOSTNOTERC)

  if (!sander.existsSync(boostnotercPath)) return {}
  try {
    return JSON.parse(sander.readFileSync(boostnotercPath).toString())
  } catch (e) {
    console.warn(e)
    console.warn('Your .boostnoterc is broken so it\'s not used.')
    return {}
  }
}

export default {
  parse
}
