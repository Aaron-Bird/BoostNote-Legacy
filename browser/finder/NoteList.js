import React, { PropTypes } from 'react'
import NoteItem from './NoteItem'
import _ from 'lodash'

class NoteList extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      range: 0
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.search !== nextProps.search) {
      this.resetScroll()
    }
  }

  componentDidUpdate () {
    let { index } = this.props

    if (index > -1) {
      let list = this.refs.root
      let item = list.childNodes[index]
      if (item == null) return null

      let overflowBelow = item.offsetTop + item.clientHeight - list.clientHeight - list.scrollTop > 0
      if (overflowBelow) {
        list.scrollTop = item.offsetTop + item.clientHeight - list.clientHeight
      }
      let overflowAbove = list.scrollTop > item.offsetTop
      if (overflowAbove) {
        list.scrollTop = item.offsetTop
      }
    }
  }

  resetScroll () {
    this.refs.root.scrollTop = 0
    this.setState({
      range: 0
    })
  }

  handleScroll (e) {
    let { notes } = this.props

    if (e.target.offsetHeight + e.target.scrollTop > e.target.scrollHeight - 100 && notes.length > this.state.range * 10 + 10) {
      this.setState({
        range: this.state.range + 1
      })
    }
  }

  render () {
    let { storages, notes, index } = this.props

    let notesList = notes
      .slice(0, 10 + 10 * this.state.range)
      .map((note, _index) => {
        let storage = _.find(storages, {key: note.storage})
        let folder = _.find(storage.folders, {key: note.folder})
        return (
          <NoteItem
            note={note}
            key={`${note.storage}-${note.folder}-${note.key}`}
            storage={storage}
            folder={folder}
            isActive={index === _index}
            onClick={(e) => this.props.handleNoteClick(e, _index)}
          />
        )
      })
    return (
      <div className={this.props.className}
        onScroll={(e) => this.handleScroll(e)}
        ref='root'
      >
        {notesList}
      </div>
    )
  }
}

NoteList.propTypes = {
}

export default NoteList
