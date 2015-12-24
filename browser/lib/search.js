'use strict'

var _ = require('lodash')

const TEXT_FILTER = 'TEXT_FILTER'
const FOLDER_FILTER = 'FOLDER_FILTER'
const TAG_FILTER = 'TAG_FILTER'

export default function search (articles, search) {
  let filters = search.split(' ').map(key => key.trim()).filter(key => key.length > 0 && !key.match(/^#$/)).map(key => {
    if (key.match(/^in:.+$/)) {
      return {type: FOLDER_FILTER, value: key.match(/^in:(.+)$/)[1]}
    }
    if (key.match(/^#(.+)/)) {
      return {type: TAG_FILTER, value: key.match(/^#(.+)$/)[1]}
    }
    return {type: TEXT_FILTER, value: key}
  })
  // let folderFilters = filters.filter(filter => filter.type === FOLDER_FILTER)
  let textFilters = filters.filter(filter => filter.type === TEXT_FILTER)
  let tagFilters = filters.filter(filter => filter.type === TAG_FILTER)

  if (textFilters.length > 0) {
    articles = textFilters.reduce((articles, textFilter) => {
      return articles.filter(article => {
        return article.title.match(new RegExp(textFilter.value, 'i')) || article.content.match(new RegExp(textFilter.value, 'i'))
      })
    }, articles)
  }

  if (tagFilters.length > 0) {
    articles = tagFilters.reduce((articles, tagFilter) => {
      return articles.filter(article => {
        return _.find(article.Tags, tag => tag.name.match(new RegExp(tagFilter.value, 'i')))
      })
    }, articles)
  }

  return articles
}
