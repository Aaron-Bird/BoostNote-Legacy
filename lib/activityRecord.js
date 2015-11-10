import _ from 'lodash'
import moment from 'moment'
import keygen from 'boost/keygen'
import dataStore from 'boost/dataStore'
import { request, WEB_URL } from 'boost/api'

function isSameDate (a, b) {
  a = moment(a).utcOffset(+540).format('YYYYMMDD')
  b = moment(b).utcOffset(+540).format('YYYYMMDD')

  return a === b
}

export function init () {
  let records = getAllRecords()
  if (records == null) {
    saveAllRecords([])
  }

  postRecords()
  if (window != null) {
    window.addEventListener('online', postRecords)
    window.setInterval(postRecords, 1000 * 60 * 60 * 24)
  }
}

export function getClientKey () {
  let clientKey = localStorage.getItem('clientKey')
  if (!_.isString(clientKey) || clientKey.length !== 40) {
    clientKey = keygen()
    localStorage.setItem('clientKey', clientKey)
  }

  return clientKey
}

export function getAllRecords () {
  return JSON.parse(localStorage.getItem('activityRecords'))
}

export function saveAllRecords (records) {
  localStorage.setItem('activityRecords', JSON.stringify(records))
}

/*
Post all records(except today)
and remove all posted records
*/
export function postRecords (data) {
  let records = getAllRecords()
  records = records.filter(record => {
    return !isSameDate(new Date(), record.date)
  })

  if (records.length === 0) {
    console.log('No records to post')
    return
  }

  console.log('posting...', records)
  let input = {
    clientKey: getClientKey(),
    records
  }
  return request.post(WEB_URL + 'apis/activity')
    .send(input)
    .then(res => {
      let records = getAllRecords()
      let todayRecord = _.find(records, record => {
        return isSameDate(new Date(), record.date)
      })
      if (todayRecord != null) saveAllRecords([todayRecord])
      else saveAllRecords([])
    })
    .catch(err => {
      console.error(err)
    })
}

export function emit (type, data) {
  let records = getAllRecords()

  let index = _.findIndex(records, record => {
    return isSameDate(new Date(), record.date)
  })

  let todayRecord
  if (index < 0) {
    todayRecord = {date: new Date()}
    records.push(todayRecord)
  }
  else todayRecord = records[index]
  console.log(type)
  switch (type) {
    case 'ARTICLE_CREATE':
    case 'ARTICLE_UPDATE':
    case 'ARTICLE_DESTROY':
    case 'FOLDER_CREATE':
    case 'FOLDER_UPDATE':
    case 'FOLDER_DESTROY':
    case 'FINDER_OPEN':
    case 'FINDER_COPY':
      todayRecord[type] = todayRecord[type] == null
        ? 1
        : todayRecord[type] + 1

      break
  }

  let storeData = dataStore.getData()
  todayRecord.FOLDER_COUNT = _.isArray(storeData.folders) ? storeData.folders.length : 0
  todayRecord.ARTICLE_COUNT = _.isArray(storeData.articles) ? storeData.articles.length : 0

  saveAllRecords(records)
}

export default {
  init,
  emit,
  getClientKey,
  postRecords
}
