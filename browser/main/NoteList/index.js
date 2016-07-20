import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NoteList.styl'
import moment from 'moment'
import _ from 'lodash'

class NoteList extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.refreshTimer = setInterval(() => this.forceUpdate(), 60 * 1000)
  }

  componentWillUnmount () {
    clearInterval(this.refreshTimer)
  }

  componentDidUpdate () {
    let { location } = this.props
    if (this.notes.length > 0 && location.query.key == null) {
      let { router } = this.context
      router.replace({
        pathname: location.pathname,
        query: {
          key: this.notes[0].uniqueKey
        }
      })
      return
    }

    // Auto scroll
    if (_.isString(location.query.key)) {
      let targetIndex = _.findIndex(this.notes, (note) => {
        return note.uniqueKey === location.query.key
      })
      if (targetIndex > -1) {
        let list = this.refs.root
        let item = list.childNodes[targetIndex]

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
  }

  focus () {
    // ReactDOM.findDOMNode(this).focus()
  }

  selectPriorNote () {
    if (this.notes == null || this.notes.length === 0) {
      return
    }
    let { router } = this.context
    let { location } = this.props

    let targetIndex = _.findIndex(this.notes, (note) => {
      return note.uniqueKey === location.query.key
    })

    if (targetIndex === 0) {
      return
    }
    targetIndex--
    if (targetIndex < 0) targetIndex = 0

    router.push({
      pathname: location.pathname,
      query: {
        key: this.notes[targetIndex].uniqueKey
      }
    })
  }

  selectNextNote () {
    if (this.notes == null || this.notes.length === 0) {
      return
    }
    let { router } = this.context
    let { location } = this.props

    let targetIndex = _.findIndex(this.notes, (note) => {
      return note.uniqueKey === location.query.key
    })

    if (targetIndex === this.notes.length - 1) {
      return
    }
    targetIndex++
    if (targetIndex < 0) targetIndex = 0
    else if (targetIndex > this.notes.length - 1) targetIndex === this.notes.length - 1

    router.push({
      pathname: location.pathname,
      query: {
        key: this.notes[targetIndex].uniqueKey
      }
    })
  }

  handleNoteListKeyDown (e) {
    if (e.metaKey || e.ctrlKey) return true

    // if (e.keyCode === 65 && !e.shiftKey) {
    //   e.preventDefault()
    //   remote.getCurrentWebContents().send('top-new-post')
    // }

    // if (e.keyCode === 65 && e.shiftKey) {
    //   e.preventDefault()
    //   remote.getCurrentWebContents().send('nav-new-folder')
    // }

    // if (e.keyCode === 68) {
    //   e.preventDefault()
    //   remote.getCurrentWebContents().send('detail-delete')
    // }

    // if (e.keyCode === 84) {
    //   e.preventDefault()
    //   remote.getCurrentWebContents().send('detail-title')
    // }

    // if (e.keyCode === 69) {
    //   e.preventDefault()
    // }

    // if (e.keyCode === 83) {
    //   e.preventDefault()
    //   remote.getCurrentWebContents().send('detail-save')
    // }

    if (e.keyCode === 38) {
      e.preventDefault()
      this.selectPriorNote()
    }

    if (e.keyCode === 40) {
      e.preventDefault()
      this.selectNextNote()
    }
  }

  getNotes () {
    let { storages, notes, params, location } = this.props

    if (location.pathname.match(/\/home/)) {
      return notes
    }

    if (location.pathname.match(/\/starred/)) {
      return notes
        .filter((note) => note.isStarred)
    }

    let storageKey = params.storageKey
    let folderKey = params.folderKey
    let storage = _.find(storages, {key: storageKey})
    if (storage == null) return []

    let folder = _.find(storage.folders, {key: folderKey})
    if (folder == null) {
      return notes
        .filter((note) => note.storage === storageKey)
    }

    return notes
      .filter((note) => note.folder === folderKey)
  }

  handleNoteClick (uniqueKey) {
    return (e) => {
      let { router } = this.context
      let { location } = this.props

      router.push({
        pathname: location.pathname,
        query: {
          key: uniqueKey
        }
      })
    }
  }

  render () {
    let { location, storages, notes } = this.props
    this.notes = notes = this.getNotes()
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

    let noteList = notes
      .map((note) => {
        let storage = _.find(storages, {key: note.storage})
        let folder = _.find(storage.folders, {key: note.folder})
        let tagElements = _.isArray(note.tags)
          ? note.tags.map((tag) => {
            return (
              <span styleName='item-tagList-item'
                key={tag}>
                {tag}
              </span>
            )
          })
          : []
        let isActive = location.query.key === note.uniqueKey
        return (
          <div styleName={isActive
              ? 'item--active'
              : 'item'
            }
            key={note.uniqueKey}
            onClick={(e) => this.handleNoteClick(note.uniqueKey)(e)}
          >
            <div styleName='item-border'/>
            <div styleName='item-info'>

              <div styleName='item-info-left'>
                <span styleName='item-info-left-folder'
                  style={{borderColor: folder.color}}
                >
                  {folder.name}
                  <span styleName='item-info-left-folder-surfix'>in {storage.name}</span>
                </span>
              </div>

              <div styleName='item-info-right'>
                {moment(note.updatedAt).fromNow()}
              </div>

            </div>

            <div styleName='item-title'>
              {note.type === 'SNIPPET_NOTE'
                ? <i styleName='item-title-icon' className='fa fa-fw fa-code'/>
                : <i styleName='item-title-icon' className='fa fa-fw fa-file-text-o'/>
              }
              {note.title.trim().length > 0
                ? note.title
                : <span styleName='item-title-empty'>Empty</span>
              }
            </div>

            <div styleName='item-tagList'>
              <i styleName='item-tagList-icon'
                className='fa fa-tags fa-fw'
              />
              {tagElements.length > 0
                ? tagElements
                : <span styleName='item-tagList-empty'>Not tagged yet</span>
              }
            </div>
          </div>
        )
      })

    return (
      <div className='NoteList'
        styleName='root'
        ref='root'
        tabIndex='0'
        onKeyDown={(e) => this.handleNoteListKeyDown(e)}
        style={this.props.style}
      >
        {noteList}
      </div>
    )
  }
}
NoteList.contextTypes = {
  router: PropTypes.shape([])
}

NoteList.propTypes = {
  dispatch: PropTypes.func,
  repositories: PropTypes.array,
  style: PropTypes.shape({
    width: PropTypes.number
  })
}

export default CSSModules(NoteList, styles)
