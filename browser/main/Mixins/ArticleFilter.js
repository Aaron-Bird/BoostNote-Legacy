function basicFilter (keyword, articles) {
  if (keyword === '' || keyword == null) return articles
  var firstFiltered = articles.filter(function (article) {

    var first = article.type === 'code' ? article.description : article.title
    if (first.match(new RegExp(keyword, 'i'))) return true

    return false
  })

  var secondFiltered = articles.filter(function (article) {
    var second = article.type === 'code' ? article.content : article.content
    if (second.match(new RegExp(keyword, 'i'))) return true

    return false
  })

  return firstFiltered.concat(secondFiltered).filter(function (value, index, self) {
    return self.indexOf(value) === index
  })
}

function codeFilter (articles) {
  return articles.filter(function (article) {
    return article.type === 'code'
  })
}

function noteFilter (articles) {
  return articles.filter(function (article) {
    return article.type === 'note'
  })
}

function tagFilter (keyword, articles) {
  return articles.filter(function (article) {
    return article.Tags.some(function (tag) {
      return tag.name.match(new RegExp('^' + keyword, 'i'))
    })
  })
}

function searchArticle (search, articles) {
  var keywords = search.split(' ')

  for (var keyword of keywords) {
    if (keyword.match(/^\$c/, 'i')) {
      articles = codeFilter(articles)
      continue
    } else if (keyword.match(/^\$n/, 'i')) {
      articles = noteFilter(articles)
      continue
    } else if (keyword.match(/^#[A-Za-z0-9]+/)) {
      articles = tagFilter(keyword.substring(1, keyword.length), articles)
      continue
    }
    articles = basicFilter(keyword, articles)
  }

  return articles.sort(function (a, b) {
    return new Date(b.updatedAt) - new Date(a.updatedAt)
  })
}

module.exports = {
  searchArticle: searchArticle
}
