const electron = require('electron')
import { connect } from 'react-redux'
const ipc = electron.ipcRenderer
import React, { PropTypes } from 'react'
import SideNav from './SideNav'
import ArticleTopBar from './ArticleTopBar'
import ArticleList from './ArticleList'
import ArticleDetail from './ArticleDetail'
import Repository from 'browser/lib/Repository'

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {updateAvailable: false}
  }

  componentDidMount () {
    let { dispatch } = this.props
    ipc.on('update-available', function (message) {
      this.setState({updateAvailable: true})
    }.bind(this))

    // Reload all data
    Repository.loadAll()
      .then((allData) => {
        dispatch({type: 'INIT_ALL', data: allData})
      })
  }

  updateApp () {
    ipc.send('update-app', 'Deal with it.')
  }

  render () {
    return (
      <div
        className='Main'
      >
        {this.state.updateAvailable ? (
          <button onClick={this.updateApp} className='appUpdateButton'><i className='fa fa-cloud-download'/> Update available!</button>
        ) : null}

        <SideNav
          ref='nav'
          {...this.props}
        />
        <ArticleTopBar
          ref='top'
          {...this.props}
        />
        <ArticleList
          ref='list'
          {...this.props}
        />
        <ArticleDetail
          ref='detail'
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
