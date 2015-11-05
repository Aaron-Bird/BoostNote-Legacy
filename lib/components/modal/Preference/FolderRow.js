import React, { PropTypes } from 'react'
import linkState from 'boost/linkState'
import FolderMark from 'boost/components/FolderMark'
import store from 'boost/store'
import { updateFolder, destroyFolder } from 'boost/actions'

const IDLE = 'IDLE'
const EDIT = 'EDIT'
const DELETE = 'DELETE'

export default class FolderRow extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      mode: IDLE
    }
  }

  handleCancelButtonClick (e) {
    this.setState({
      mode: IDLE
    })
  }

  handleEditButtonClick (e) {
    this.setState({
      mode: EDIT,
      name: this.props.folder.name
    })
  }

  handleDeleteButtonClick (e) {
    this.setState({mode: DELETE})
  }

  handleSaveButtonClick (e) {
    let { folder, setAlert } = this.props

    setAlert(null, () => {
      let input = {
        name: this.state.name
      }
      folder = Object.assign({}, folder, input)

      try {
        store.dispatch(updateFolder(folder))
        this.setState({
          mode: IDLE
        })
      } catch (e) {
        console.error(e)
        setAlert({
          type: 'error',
          message: e.message
        })
      }
    })
  }

  handleDeleteConfirmButtonClick (e) {
    let { folder } = this.props
    store.dispatch(destroyFolder(folder.key))
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
            <div className='folderName'><FolderMark color={folder.color}/> {folder.name}</div>
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
  folder: PropTypes.shape(),
  setAlert: PropTypes.func
}

FolderRow.prototype.linkState = linkState
