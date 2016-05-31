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
      return
    }

    // Auto scroll
    let splitted = location.query.key.split('-')
    let repoKey = splitted[0]
    let noteKey = splitted[1]
    let targetIndex = _.findIndex(this.notes, (note) => {
      return repoKey === note._repository.key && noteKey === note.key
    })
    if (targetIndex > -1) {
      let list = this.refs.root
      let item = list.childNodes[targetIndex]

      let overflowBelow = list.clientHeight + list.scrollTop < item.offsetTop + list.clientHeight
      if (overflowBelow) {
        list.scrollTop = item.offsetTop + item.clientHeight - list.clientHeight
      }
      let overflowAbove = list.scrollTop > item.offsetTop
      if (overflowAbove) {
        list.scrollTop = item.offsetTop
      }
    }
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
        return sum.concat(repository.notes)
      }, [])
    }

    if (location.pathname.match(/\/starred/)) {
      return repositories
      .reduce((sum, repository) => {
        return sum.concat(repository.starred
          .map((starredKey) => {
            return _.find(repository.notes, {key: starredKey})
          })
          .filter((note) => _.isObject(note)))
      }, [])
    }

    let repository = _.find(repositories, {key: repositoryKey})
    if (repository == null) return []

    let folder = _.find(repository.folders, {key: folderKey})
    if (folder == null) {
      return repository.notes
    }

    return repository.notes
      .filter((note) => note.folder === folderKey)
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
    let notes = this.notes = this.getNotes().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

    let noteElements = notes
      .map((note) => {
        let folder = _.find(note._repository.folders, {key: note.folder})
        let tagElements = note.tags.map((tag) => {
          return (
            <span styleName='item-tagList-item'
              key={tag}>
              {tag}
            </span>
          )
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
