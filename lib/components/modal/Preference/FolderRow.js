import React, { PropTypes } from 'react'
import api from 'boost/api'
import linkState from 'boost/linkState'
import FolderMark from 'boost/components/FolderMark'

const IDLE = 'IDLE'
const EDIT = 'EDIT'
const DELETE = 'DELETE'

export default class FolderRow extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      mode: IDLE,
      name: props.folder.name,
      public: props.folder.public
    }
  }

  handleCancelButtonClick (e) {
    this.setState({
      mode: IDLE,
      name: this.props.folder.name,
      public: this.props.folder.public
    })
  }

  handleEditButtonClick (e) {
    this.setState({mode: EDIT})
  }

  handleDeleteButtonClick (e) {
    this.setState({mode: DELETE})
  }

  handleFolderPublicChange (e) {
    this.setState({public: e.target.value})
  }

  handleSaveButtonClick (e) {
    let input = {
      name: this.state.name,
      public: !!parseInt(this.state.public, 10)
    }

    api.updateFolder(this.props.folder.id, input)
      .then(res => {
        console.log(res.body)
        this.setState({mode: IDLE})
      })
      .catch(err => {
        if (err.status != null) throw err
        else console.error(err)
      })
  }

  handleDeleteConfirmButtonClick (e) {
    api.destroyFolder(this.props.folder.id)
      .then(res => {
        console.log(res.body)
      })
      .catch(err => {
        if (err.status != null) throw err
        else console.error(err)
      })
  }

  render () {
    let folder = this.props.folder

    switch (this.state.mode) {
      case EDIT:
        return (
          <div className='FolderRow edit'>
            <div className='folderName'>
              <input valueLink={this.linkState('name')} type='text'/>
            </div>
            <div className='folderPublic'>
              <select value={this.state.public} onChange={e => this.handleFolderPublicChange(e)}>
                <option value='0'>Private</option>
                <option value='1'>Public</option>
              </select>
            </div>
            <div className='folderControl'>
              <button onClick={e => this.handleSaveButtonClick(e)} className='primary'>Save</button>
              <button onClick={e => this.handleCancelButtonClick(e)}>Cancel</button>
            </div>
          </div>
        )
      case DELETE:
        return (
          <div className='FolderRow delete'>
            <div className='folderDeleteLabel'>Are you sure to delete <strong>{folder.name}</strong> folder?</div>
            <div className='folderControl'>
              <button onClick={e => this.handleDeleteConfirmButtonClick(e)} className='primary'>Sure</button>
              <button onClick={e => this.handleCancelButtonClick(e)}>Cancel</button>
            </div>
          </div>
        )
      case IDLE:
      default:
        return (
          <div className='FolderRow'>
            <div className='folderName'><FolderMark id={folder.id}/> {folder.name}</div>
            <div className='folderPublic'>{folder.public ? 'Public' : 'Private'}</div>
            <div className='folderControl'>
              <button onClick={e => this.handleEditButtonClick(e)}><i className='fa fa-fw fa-edit'/></button>
              <button onClick={e => this.handleDeleteButtonClick(e)}><i className='fa fa-fw fa-close'/></button>
            </div>
          </div>
        )
    }
  }
}

FolderRow.propTypes = {
  folder: PropTypes.shape()
}

FolderRow.prototype.linkState = linkState
