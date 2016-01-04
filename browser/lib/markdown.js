import markdownit from 'markdown-it'
import hljs from 'highlight.js'
import emoji from 'markdown-it-emoji'
import math from 'markdown-it-math'

var md = markdownit({
  typographer: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } catch (__) {}
    }

    try {
      return hljs.highlightAuto(str).value
    } catch (__) {}

    return ''
  }
})
md.use(emoji)
md.use(math, {
  inlineRenderer: function (str) {
    return `<span class='math'>${str}</span>`
  },
  blockRenderer: function (str) {
    return `<div class='math'>${str}</div>`
  }
})

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
