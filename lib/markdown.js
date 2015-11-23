import markdownit from 'markdown-it'
import hljs from 'highlight.js'

var md = markdownit({
  typographer: true,
  linkify: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    try {
      return hljs.highlightAuto(str).value;
    } catch (__) {}

    return ''; // use external default escaping
  }
})

export default function markdown (content) {
  if (content == null) content = ''
  return md.render(content.toString())
}
