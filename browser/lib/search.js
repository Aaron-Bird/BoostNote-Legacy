import _ from 'lodash'

export default function searchFromNotes(data, search) {
  let notes = data.noteMap.map((note) => note)
  if (search.trim().length === 0) return []
  let searchBlocks = search.split(' ')
  searchBlocks.forEach((block) => {
    if (block.match(/^#.+/)) {
      const tag = block.match(/#(.+)/)[1]
      notes = findByTag(notes, tag)
    } else {
      notes = findByWord(notes, block)
    }
  })
  return notes
}

function findByTag(notes, tag) {
  let regExp = new RegExp(_.escapeRegExp(tag), 'i')
  return notes.filter((note) => {
    if(!_.isArray(note.tags)) return false
    return note.tags.some((_tag) => {
      return _tag.match(regExp)
    })
  })
}

function findByWord(notes, block) {
  let regExp = new RegExp(_.escapeRegExp(block), 'i')
  return notes.filter((note) => {
    if (_.isArray(note.tags) && note.tags.some((_tag) => {
      return _tag.match(regExp)
    })) {
      return true
    }
    if (note.type === 'SNIPPET_NOTE') {
      return note.description.match(regExp)
    } else if (note.type === 'MARKDOWN_NOTE') {
      return note.content.match(regExp)
    }
    return false
  })
}
