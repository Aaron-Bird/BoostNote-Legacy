import React, { PropTypes } from 'react'
import FolderRow from './FolderRow'
import linkState from 'browser/lib/linkState'
import { createFolder } from '../../actions'

export default class FolderSettingTab extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: ''
    }
  }

  handleNewFolderNameKeyDown (e) {
    if (e.keyCode === 13) {
      this.handleSaveButtonClick()
    }
  }

  handleSaveButtonClick (e) {
    this.setState({alert: null}, () => {
      if (this.state.name.trim().length === 0) return false

      let { dispatch } = this.props

      try {
        dispatch(createFolder({
          name: this.state.name
        }))
      } catch (e) {
        this.setState({alert: {
          type: 'error',
          message: e.message
        }})
        return
      }

      this.setState({name: ''})
    })
  }

  setAlert (alert, cb) {
    this.setState({alert: alert}, cb)
  }

  render () {
    let { folders } = this.props
    let folderElements = folders.map((folder, index) => {
      return (
        <FolderRow
          key={'folder-' + folder.key}
          folder={folder}
          index={index}
          count={folders.length}
          setAlert={(alert, cb) => this.setAlert(alert, cb)}
        />
      )
    })

    let alert = this.state.alert
    let alertElement = alert != null ? (
        <p className={`alert ${alert.type}`}>
          {alert.message}
        </p>
      ) : null

    return (
      <div className='FolderSettingTab content'>
        <div className='section'>
          <div className='sectionTitle'>Manage folder</div>
          <div className='folderTable'>
            <div className='folderHeader'>
              <div className='folderName'>Folder</div>
              <div className='folderControl'>Edit/Delete</div>
            </div>
            {folderElements}
            <div className='newFolder'>
              <div className='folderName'>
                <input onKeyDown={e => this.handleNewFolderNameKeyDown(e)} valueLink={this.linkState('name')} type='text' placeholder='New Folder'/>
              </div>
              <div className='folderControl'>
                <button onClick={e => this.handleSaveButtonClick(e)} className='primary'>Add</button>
              </div>
            </div>
            {alertElement}
          </div>
        </div>
      </div>
    )
  }
}

FolderSettingTab.propTypes = {
  folders: PropTypes.array,
  dispatch: PropTypes.func
}

FolderSettingTab.prototype.linkState = linkState
