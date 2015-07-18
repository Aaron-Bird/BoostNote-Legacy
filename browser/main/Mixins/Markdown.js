var markdownit = require('markdown-it')
var md = markdownit({
  typographer: true,
  linkify: true
})

var Markdown = {
  markdown: function (content) {
    return md.render(content)
  }
}

module.exports = Markdown
