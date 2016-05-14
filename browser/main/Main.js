import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import SideNav from './SideNav'
import TopBar from './TopBar'
import ArticleList from './ArticleList'
import ArticleDetail from './ArticleDetail'
import Repository from 'browser/lib/Repository'
import StatusBar from './StatusBar'

class Main extends React.Component {
  componentDidMount () {
    let { dispatch } = this.props

    // Reload all data
    Repository.loadAll()
      .then((allData) => {
        dispatch({type: 'INIT_ALL', data: allData})
      })
  }

  render () {
    return (
      <div
        className='Main'
      >
        <SideNav
          {...this.props}
        />
        <TopBar
          {...this.props}
        />
        <ArticleList
          {...this.props}
        />
        <ArticleDetail
          {...this.props}
        />
        <StatusBar
          {...this.props}
        />
      </div>
    )
  }
}

Main.propTypes = {
  dispatch: PropTypes.func,
  repositories: PropTypes.array
}

export default connect((x) => x)(Main)
