import _ from 'lodash'
import moment from 'moment'
import dataStore from './dataStore'
import { request, SERVER_URL } from './api'
import clientKey from './clientKey'

const electron = require('electron')
const version = electron.remote.app.getVersion()

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
  emit(null)

  postRecords()
  if (window != null) {
    window.addEventListener('online', postRecords)
    window.setInterval(postRecords, 1000 * 60 * 60 * 24)
  }
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
  if (process.NODE_ENV !== 'production') {
    console.log('post failed - NOT PRODUCTION ')
    return
  }

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
    clientKey: clientKey.get(),
    records
  }
  return request.post(SERVER_URL + 'apis/activity')
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

export function emit (type, data = {}) {
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
  switch (type) {
    case 'ARTICLE_CREATE':
    case 'ARTICLE_UPDATE':
    case 'ARTICLE_DESTROY':
    case 'FOLDER_CREATE':
    case 'FOLDER_UPDATE':
    case 'FOLDER_DESTROY':
    case 'FINDER_OPEN':
    case 'FINDER_COPY':
    case 'MAIN_DETAIL_COPY':
    case 'ARTICLE_SHARE':
      todayRecord[type] = todayRecord[type] == null
        ? 1
        : todayRecord[type] + 1

      break
  }

  // Count ARTICLE_CREATE and ARTICLE_UPDATE again by syntax
  if ((type === 'ARTICLE_CREATE' || type === 'ARTICLE_UPDATE') && data.mode != null) {
    let recordKey = type + '_BY_SYNTAX'
    if (todayRecord[recordKey] == null) todayRecord[recordKey] = {}

    todayRecord[recordKey][data.mode] = todayRecord[recordKey][data.mode] == null
      ? 1
      : todayRecord[recordKey][data.mode] + 1
  }

  let storeData = dataStore.getData()
  todayRecord.FOLDER_COUNT = storeData && _.isArray(storeData.folders) ? storeData.folders.length : 0
  todayRecord.ARTICLE_COUNT = storeData && _.isArray(storeData.articles) ? storeData.articles.length : 0
  todayRecord.CLIENT_VERSION = version

  todayRecord.SYNTAX_COUNT = storeData && _.isArray(storeData.articles) ? storeData.articles.reduce((sum, article) => {
    if (sum[article.mode] == null) sum[article.mode] = 1
    else sum[article.mode]++
    return sum
  }, {}) : 0

  saveAllRecords(records)
}

export default {
  init,
  emit,
  postRecords
}
