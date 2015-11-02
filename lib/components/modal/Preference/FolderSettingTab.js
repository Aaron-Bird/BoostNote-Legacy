import React, { PropTypes } from 'react'
import FolderRow from './FolderRow'
import linkState from 'boost/linkState'
import { createFolder } from 'boost/actions'

export default class FolderSettingTab extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: ''
    }
  }

  handleSaveButtonClick (e) {
    if (this.state.name.trim().length === 0) return false

    let { dispatch } = this.props

    dispatch(createFolder({
      name: this.state.name
    }))

    this.setState({name: ''})
  }

  render () {
    let { folders } = this.props
    let folderElements = folders.map(folder => {
      return (
        <FolderRow key={'folder-' + folder.key} folder={folder}/>
        )
    })

    return (
      <div className='FolderSettingTab content'>
        <div className='section'>
          <div className='sectionTitle'>Manage folder</div>
          <div className='folderTable'>
            <div className='folderHeader'>
              <div className='folderName'>Folder name</div>
              <div className='folderControl'>Edit/Delete</div>
            </div>
            {folderElements}
            <div className='newFolder'>
              <div className='folderName'>
                <input valueLink={this.linkState('name')} type='text' placeholder='New Folder'/>
              </div>
              <div className='folderControl'>
                <button onClick={e => this.handleSaveButtonClick(e)} className='primary'>Add</button>
              </div>
            </div>
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
