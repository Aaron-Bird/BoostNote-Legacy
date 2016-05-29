import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NoteList.styl'
import moment from 'moment'
import _ from 'lodash'

class NoteList extends React.Component {
  constructor (props) {
    super(props)

    // this.focusHandler = (e) => this.focus()
  }

  componentDidMount () {
    // this.refreshTimer = setInterval(() => this.forceUpdate(), 60 * 1000)
    // ipc.on('list-focus', this.focusHandler)
    // this.focus()
  }

  componentWillUnmount () {
    // clearInterval(this.refreshTimer)
    // ipc.removeListener('list-focus', this.focusHandler)
  }

  componentDidUpdate () {
    let { location } = this.props
    if (this.notes.length > 0 && location.query.key == null) {
      let { router } = this.context
      router.replace({
        pathname: location.pathname,
        query: {
          key: `${this.notes[0]._repository.key}-${this.notes[0].key}`
        }
      })
    }
    // return false
    // var index = articles.indexOf(null)
    // var el = ReactDOM.findDOMNode(this)
    // var li = el.querySelectorAll('.NoteList>div')[index]

    // if (li == null) {
    //   return
    // }

    // var overflowBelow = el.clientHeight + el.scrollTop < li.offsetTop + li.clientHeight
    // if (overflowBelow) {
    //   el.scrollTop = li.offsetTop + li.clientHeight - el.clientHeight
    // }
    // var overflowAbove = el.scrollTop > li.offsetTop
    // if (overflowAbove) {
    //   el.scrollTop = li.offsetTop
    // }
  }

  focus () {
    // ReactDOM.findDOMNode(this).focus()
  }

  // 移動ができなかったらfalseを返す:
  selectPriorArticle () {
    // let { articles, activeArticle, dispatch } = this.props
    // let targetIndex = articles.indexOf(activeArticle) - 1
    // let targetArticle = articles[targetIndex]
    // return false
  }

  selectNextArticle () {
    // let { articles, activeArticle, dispatch } = this.props
    // let targetIndex = articles.indexOf(activeArticle) + 1
    // let targetArticle = articles[targetIndex]

    // if (targetArticle != null) {
    //   dispatch(switchArticle(targetArticle.key))
    //   return true
    // }
    // return false
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
    //   remote.getCurrentWebContents().send('detail-edit')
    // }

    // if (e.keyCode === 83) {
    //   e.preventDefault()
    //   remote.getCurrentWebContents().send('detail-save')
    // }

    if (e.keyCode === 38) {
      e.preventDefault()
      this.selectPriorArticle()
    }

    if (e.keyCode === 40) {
      e.preventDefault()
      this.selectNextArticle()
    }
  }

  getNotes () {
    let { repositories, params, location } = this.props
    let repositoryKey = params.repositoryKey
    let folderKey = params.folderKey

    if (location.pathname.match(/\/home/)) {
      return repositories
      .reduce((sum, repository) => {
        return sum.concat(repository.notes
          .map((note) => {
            note._repository = repository
            return note
          }))
      }, [])
    }

    if (location.pathname.match(/\/starred/)) {
      return repositories
      .reduce((sum, repository) => {
        return sum.concat(repository.starred
          .map((starredKey) => {
            return _.find(repository.notes, {key: starredKey})
          })
          .filter((note) => _.isObject(note))
          .map((note) => {
            note._repository = repository
            return note
          }))
      }, [])
    }

    let repository = _.find(repositories, {key: repositoryKey})
    if (repository == null) return []

    let folder = _.find(repository.folders, {key: folderKey})
    if (folder == null) {
      return repository.notes
        .map((note) => {
          note._repository = repository
          return note
        })
    }

    return repository.notes
      .filter((note) => note.folder === folderKey)
      .map((note) => {
        note._repository = repository
        return note
      })
  }

  handleNoteClick (key) {
    return (e) => {
      let { router } = this.context
      let { location } = this.props

      router.push({
        pathname: location.pathname,
        query: {
          key: key
        }
      })
    }
  }

  render () {
    let { location } = this.props
    let notes = this.notes = this.getNotes()
    let noteElements = notes
      .map((note) => {
        let folder = _.find(note._repository.folders, {key: note.folder})
        let tagElements = note.tags.map((tag) => {
          return <span key={tag}>{tag}</span>
        })
        let key = `${note._repository.key}-${note.key}`
        let isActive = location.query.key === key
        return (
          <div styleName={isActive
              ? 'item--active'
              : 'item'
            }
            key={key}
            onClick={(e) => this.handleNoteClick(key)(e)}
          >
            <div styleName='item-border'/>
            <div styleName='item-info'>

              <div styleName='item-info-left'>
                <i className='fa fa-cube fa-fw' style={{color: folder.color}}/> {folder.name}
              </div>

              <div styleName='item-info-right'>
                {moment(note.updatedAt).fromNow()}
              </div>

            </div>

            <div styleName='item-title'>{note.title}</div>

            <div styleName='item-tags'><i className='fa fa-tags fa-fw'/>{tagElements.length > 0 ? tagElements : <span>Not tagged yet</span>}</div>

          </div>
        )
      })

    return (
      <div className='NoteList'
        styleName='root'
        tabIndex='0'
        onKeyDown={(e) => this.handleNoteListKeyDown(e)}
        style={this.props.style}
      >
        {noteElements}
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
