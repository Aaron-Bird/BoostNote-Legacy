const _ = require('lodash')
const keygen = require('browser/lib/keygen')
const Mixpanel = require('mixpanel')
const mixpanel = Mixpanel.init('7a0aca437d72dfd07cbcbf58d3b61f27', {key: 'fde4fd23f4d550f1b646bcd7d4374b1f'})
const moment = require('moment')

function _getClientKey () {
  let clientKey = localStorage.getItem('clientKey')
  if (!_.isString(clientKey) || clientKey.length !== 40) {
    clientKey = keygen(20)
    _setClientKey(clientKey)
  }

  return clientKey
}

function _setClientKey (newKey) {
  localStorage.setItem('clientKey', newKey)
}

function _fetch () {
  let events
  try {
    events = JSON.parse(localStorage.getItem('events'))
    if (!_.isArray(events)) throw new Error('events is not an array.')
  } catch (err) {
    console.warn(err)
    events = []
    localStorage.setItem('events', JSON.stringify(events))
    console.info('Events cache initialzed')
  }
  return events
}

function _keep (name, properties) {
  let events = _fetch()
  properties.time = new Date()
  events.push({
    name,
    properties
  })
  localStorage.setItem('events', JSON.stringify(events))
}

function _flush () {
  let events = _fetch()
  let spliced = events.splice(0, 50)
  localStorage.setItem('events', JSON.stringify(events))

  if (spliced.length > 0) {
    let parsedEvents = spliced
      .filter((event) => {
        if (!_.isObject(event)) return false
        if (!_.isString(event.name)) return false
        if (!_.isObject(event.properties)) return false
        if (!moment(event.properties.time).isValid()) return false
        if (new Date() - moment(event.properties.time).toDate() > 1000 * 3600 * 24 * 3) return false
        return true
      })
      .map((event) => {
        return {
          event: event.name,
          properties: event.properties
        }
      })

    mixpanel.import_batch(parsedEvents, {}, (errs) => {
      if (errs.length > 0) {
        let events = _fetch()
        events = events.concat(spliced)
        localStorage.setItem('events', JSON.stringify(events))
      } else {
        _flush()
      }
    })
  }
}

setInterval(_flush, 1000 * 60 * 60)

function track (name, properties) {
  properties = Object.assign({}, properties, {
    distinct_id: _getClientKey()
  })
  _keep(name, properties)
}

module.exports = {
  _mp: mixpanel,
  track
}
