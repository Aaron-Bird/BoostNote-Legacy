import markdownit from 'markdown-it'
import emoji from 'markdown-it-emoji'
import math from 'markdown-it-math'
import hljs from 'highlight.js'

var md = markdownit({
  typographer: true,
  linkify: true,
  html: true,
  xhtmlOut: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
        hljs.highlight(lang, str).value +
        '</code></pre>'
      } catch (e) {}
    }
    return '<pre class="hljs"><code>' +
    str.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;') +
    '</code></pre>'
  }
})
md.use(emoji, {
  shortcuts: {}
})
md.use(math, {
  inlineRenderer: function (str) {
    return `<span class='math'>${str}</span>`
  },
  blockRenderer: function (str) {
    return `<div class='math'>${str}</div>`
  }
})
md.use(require('markdown-it-checkbox'))

let originalRenderToken = md.renderer.renderToken
md.renderer.renderToken = function renderToken (tokens, idx, options) {
  let token = tokens[idx]

  let result = originalRenderToken.call(md.renderer, tokens, idx, options)
  if (token.map != null) {
    return result + '<a class=\'lineAnchor\' data-key=\'' + token.map[0] + '\'></a>'
  }
  return result
}

export default function markdown (content) {
  if (content == null) content = ''

  return md.render(content.toString())
}
