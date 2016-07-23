import markdownit from 'markdown-it'
import emoji from 'markdown-it-emoji'
import math from '@rokt33r/markdown-it-math'
import hljs from 'highlight.js'

const katex = window.katex

function createGutter (str) {
  let lc = (str.match(/\n/g) || []).length
  let lines = []
  for (let i = 1; i <= lc; i++) {
    lines.push('<span>' + i + '</span>')
  }
  return '<span class="lineNumber">' + lines.join('') + '</span>'
}

var md = markdownit({
  typographer: true,
  linkify: true,
  html: true,
  xhtmlOut: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs">' +
        createGutter(str) +
        '<code>' +
        hljs.highlight(lang, str).value +
        '</code></pre>'
      } catch (e) {}
    }
    return '<pre class="hljs">' +
    createGutter(str) +
    '<code>' +
    str.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;') +
    '</code></pre>'
  }
})
md.use(emoji, {
  shortcuts: {}
})
md.use(math, {
  inlineRenderer: function (str) {
    let output = ''
    try {
      output = katex.renderToString(str.trim())
    } catch (err) {
      output = `<span class="katex-error">${err.message}</span>`
    }
    return output
  },
  blockRenderer: function (str) {
    let output = ''
    try {
      output = katex.renderToString(str.trim(), {displayMode: true})
    } catch (err) {
      output = `<div class="katex-error">${err.message}</div>`
    }
    return output
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
