import _ from 'lodash'

export default function searchFromNotes(notes, search) {
  if (search.trim().length === 0) return []
  const searchBlocks = search.split(' ').filter(block => {
    return block !== ''
  })

  let foundNotes = notes
  searchBlocks.forEach(block => {
    foundNotes = findByWordOrTag(foundNotes, block)
  })
  return foundNotes
}

export function searchLineFromNote(note, search) {
  if (search.trim().length === 0) return []
  if (note.type !== 'MARKDOWN_NOTE') return []
  const searchBlocks = search.split(' ').reduce((list, block) => {
    if (block) {
      list.push(_.escapeRegExp(block))
    }
    return list
  }, [])

  const lineRegExp = new RegExp(searchBlocks.join('|'), 'i')
  const lineList = note.content.split('\n').map((lineContent, index) => {
    return {
      content: lineContent,
      index
    }
  })
  return lineList.filter(line => lineRegExp.test(line.content))
}

function findByWordOrTag(notes, block) {
  let tag = block
  if (tag.match(/^#.+/)) {
    tag = tag.match(/#(.+)/)[1]
  }
  const tagRegExp = new RegExp(_.escapeRegExp(tag), 'i')
  const wordRegExp = new RegExp(_.escapeRegExp(block), 'i')
  return notes.filter(note => {
    if (_.isArray(note.tags) && note.tags.some(_tag => _tag.match(tagRegExp))) {
      return true
    }
    if (note.type === 'SNIPPET_NOTE') {
      return (
        note.description.match(wordRegExp) ||
        note.snippets.some(snippet => {
          return (
            snippet.name.match(wordRegExp) || snippet.content.match(wordRegExp)
          )
        })
      )
    } else if (note.type === 'MARKDOWN_NOTE') {
      return note.content.match(wordRegExp)
    }
    return false
  })
}
