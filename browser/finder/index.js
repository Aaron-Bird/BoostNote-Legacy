import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import reducer from './reducer'
import { createStore } from 'redux'
import FinderInput from './FinderInput'
import FinderList from './FinderList'
import FinderDetail from './FinderDetail'
import { selectArticle, searchArticle, refreshData } from './actions'
import _ from 'lodash'

import remote from 'remote'
var hideFinder = remote.getGlobal('hideFinder')
import clipboard from 'clipboard'

require('../styles/finder/index.styl')

const FOLDER_FILTER = 'FOLDER_FILTER'
const TEXT_FILTER = 'TEXT_FILTER'
const TAG_FILTER = 'TAG_FILTER'

class FinderMain extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    ReactDOM.findDOMNode(this.refs.finderInput.refs.input).focus()
  }

  handleClick (e) {
    ReactDOM.findDOMNode(this.refs.finderInput.refs.input).focus()
  }

  handleKeyDown (e) {
    if (e.keyCode === 38) {
      this.selectPrevious()
      e.preventDefault()
    }

    if (e.keyCode === 40) {
      this.selectNext()
      e.preventDefault()
    }

    if (e.keyCode === 13) {
      let { activeArticle } = this.props
      clipboard.writeText(activeArticle.content)
      hideFinder()
      e.preventDefault()
    }
    if (e.keyCode === 27) {
      hideFinder()
      e.preventDefault()
    }
  }

  handleSearchChange (e) {
    let { dispatch } = this.props

    dispatch(searchArticle(e.target.value))
  }

  selectArticle (article) {
    this.setState({currentArticle: article})
  }

  selectPrevious () {
    let { activeArticle, dispatch } = this.props
    let index = this.refs.finderList.props.articles.indexOf(activeArticle)
    let previousArticle = this.refs.finderList.props.articles[index - 1]
    if (previousArticle != null) dispatch(selectArticle(previousArticle.key))
  }

  selectNext () {
    let { activeArticle, dispatch } = this.props
    let index = this.refs.finderList.props.articles.indexOf(activeArticle)
    let previousArticle = this.refs.finderList.props.articles[index + 1]
    if (previousArticle != null) dispatch(selectArticle(previousArticle.key))
  }

  render () {
    let { articles, activeArticle, status, dispatch } = this.props
    return (
      <div onClick={e => this.handleClick(e)} onKeyDown={e => this.handleKeyDown(e)} className='Finder'>
        <FinderInput
          handleSearchChange={e => this.handleSearchChange(e)}
          ref='finderInput'
          onChange={this.handleChange}
          value={status.search}
        />
        <FinderList
          ref='finderList'
          activeArticle={activeArticle}
          articles={articles}
          dispatch={dispatch}
          selectArticle={article => this.selectArticle(article)}
        />
        <FinderDetail activeArticle={activeArticle}/>
      </div>
    )
  }
}

FinderMain.propTypes = {
  articles: PropTypes.array,
  activeArticle: PropTypes.shape({
    key: PropTypes.string,
    tags: PropTypes.array,
    title: PropTypes.string,
    content: PropTypes.string
  }),
  status: PropTypes.shape(),
  dispatch: PropTypes.func
}

function remap (state) {
  let { articles, folders, status } = state

  let filters = status.search.split(' ').map(key => key.trim()).filter(key => key.length > 0 && !key.match(/^#$/)).map(key => {
    if (key.match(/^in:.+$/)) {
      return {type: FOLDER_FILTER, value: key.match(/^in:(.+)$/)[1]}
    }
    if (key.match(/^#(.+)/)) {
      return {type: TAG_FILTER, value: key.match(/^#(.+)$/)[1]}
    }
    return {type: TEXT_FILTER, value: key}
  })
  let folderFilters = filters.filter(filter => filter.type === FOLDER_FILTER)
  let textFilters = filters.filter(filter => filter.type === TEXT_FILTER)
  let tagFilters = filters.filter(filter => filter.type === TAG_FILTER)

  if (folders != null) {
    let targetFolders = folders.filter(folder => {
      return _.findWhere(folderFilters, {value: folder.name})
    })
    status.targetFolders = targetFolders

    if (targetFolders.length > 0) {
      articles = articles.filter(article => {
        return _.findWhere(targetFolders, {key: article.FolderKey})
      })
    }

    if (textFilters.length > 0) {
      articles = textFilters.reduce((articles, textFilter) => {
        return articles.filter(article => {
          return article.title.match(new RegExp(textFilter.value, 'i')) || article.content.match(new RegExp(textFilter.value, 'i'))
        })
      }, articles)
    }

    if (tagFilters.length > 0) {
      articles = tagFilters.reduce((articles, tagFilter) => {
        return articles.filter(article => {
          return _.find(article.tags, tag => tag.match(new RegExp(tagFilter.value, 'i')))
        })
      }, articles)
    }
  }

  let activeArticle = _.findWhere(articles, {key: status.articleKey})
  if (activeArticle == null) activeArticle = articles[0]

  return {
    articles,
    activeArticle,
    status
  }
}

var Finder = connect(remap)(FinderMain)
var store = createStore(reducer)

window.onfocus = e => {
  store.dispatch(refreshData())
}

ReactDOM.render((
  <Provider store={store}>
    <Finder/>
  </Provider>
), document.getElementById('content'))
