import markdownit from 'markdown-it'

var md = markdownit({
  typographer: true,
  linkify: true
})

export default function markdown (content) {
  if (content == null) content = ''
  return md.render(content.toString())
}
