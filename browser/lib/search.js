export default function searchFromNotes(data, search) {
  let notes = data.noteMap.map((note) => note)
  if (search.trim().length === 0) return []
  let searchBlocks = search.split(' ')
  searchBlocks.forEach((block) => {
  if (block.match(/^!#.+/)) {
    let tag = block.match(/^!#(.+)/)[1]
    let regExp = new RegExp(_.escapeRegExp(tag), 'i')
    notes = notes
      .filter((note) => {
        if (!_.isArray(note.tags)) return false
          return note.tags.some((_tag) => {
          return _tag.match(regExp)
        })
      })
  } else if (block.match(/^!.+/)) {
    let block = block.match(/^!(.+)/)[1]
    let regExp = new RegExp(_.escapeRegExp(block), 'i')
    notes = notes.filter((note) => {
      if (!_.isArray(note.tags) || !note.tags.some((_tag) => {
        return _tag.match(regExp)
      })) {
        return true
      }
      if (note.type === 'SNIPPET_NOTE') {
        return !note.description.match(regExp)
      } else if (note.type === 'MARKDOWN_NOTE') {
        return !note.content.match(regExp)
      }
      return false
    })
  } else if (block.match(/^#.+/)) {
    let tag = block.match(/#(.+)/)[1]
    let regExp = new RegExp(_.escapeRegExp(tag), 'i')
    notes = notes
      .filter((note) => {
        if (!_.isArray(note.tags)) return false
        return note.tags.some((_tag) => {
          return _tag.match(regExp)
        })
      })
  } else {
    let regExp = new RegExp(_.escapeRegExp(block), 'i')
    notes = notes.filter((note) => {
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
})

  return notes

}
