export const SELECT_ARTICLE = 'SELECT_ARTICLE'
export const SEARCH_ARTICLE = 'SEARCH_ARTICLE'
export const REFRESH_DATA = 'REFRESH_DATA'

export function selectArticle (key) {
  return {
    type: SELECT_ARTICLE,
    data: { key }
  }
}

export function searchArticle (input) {
  return {
    type: SEARCH_ARTICLE,
    data: { input }
  }
}

export function refreshData (data) {
  console.log('refreshing data')
  let { folders, articles } = data

  return {
    type: REFRESH_DATA,
    data: {
      articles,
      folders
    }
  }
}
