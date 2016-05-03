import React, { PropTypes } from 'react'
import linkState from 'browser/lib/linkState'
import FolderMark from 'browser/components/FolderMark'
import store from '../../store'

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

  handleUpClick (e) {
    let { index } = this.props
    if (index > 0) {
      // store.dispatch(replaceFolder(index, index - 1))
    }
  }

  handleDownClick (e) {
    let { index, count } = this.props
    if (index < count - 1) {
      // store.dispatch(replaceFolder(index, index + 1))
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
      name: this.props.folder.name,
      color: this.props.folder.color,
      isColorEditing: false
    })
  }

  handleDeleteButtonClick (e) {
    this.setState({mode: DELETE})
  }

  handleNameInputKeyDown (e) {
    if (e.keyCode === 13) {
      this.handleSaveButtonClick()
    }
  }

  handleColorSelectClick (e) {
    this.setState({
      isColorEditing: true
    })
  }

  handleColorButtonClick (index) {
    return (e) => {
      this.setState({
        color: index,
        isColorEditing: false
      })
    }
  }

  handleSaveButtonClick (e) {
    let { folder, setAlert } = this.props

    setAlert(null, () => {
      let input = {
        name: this.state.name,
        color: this.state.color
      }
      folder = Object.assign({}, folder, input)

      try {
        // store.dispatch(updateFolder(folder))
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
    // store.dispatch(destroyFolder(folder.key))
  }

  render () {
    let folder = this.props.folder

    switch (this.state.mode) {
      case EDIT:
        let colorIndexes = []
        for (let i = 0; i < 8; i++) {
          colorIndexes.push(i)
        }

        let colorOptions = colorIndexes.map((index) => {
          let className = this.state.color === index
            ? 'active'
            : null
          return (
            <button onClick={(e) => this.handleColorButtonClick(index)(e)} className={className} key={index}>
              <FolderMark color={index}/>
            </button>
          )
        })

        return (
          <div className='FolderRow edit'>
            <div className='folderColor'>
              <button onClick={(e) => this.handleColorSelectClick(e)} className='select'>
                <FolderMark color={this.state.color}/>
              </button>
              {this.state.isColorEditing
                ? <div className='options'>
                  <div className='label'>Color select</div>
                  {colorOptions}
                </div>
                : null
              }
            </div>
            <div className='folderName'>
              <input onKeyDown={(e) => this.handleNameInputKeyDown(e)} valueLink={this.linkState('name')} type='text'/>
            </div>
            <div className='folderControl'>
              <button onClick={(e) => this.handleSaveButtonClick(e)} className='primary'>Save</button>
              <button onClick={(e) => this.handleCancelButtonClick(e)}>Cancel</button>
            </div>
          </div>
        )
      case DELETE:
        return (
          <div className='FolderRow delete'>
            <div className='folderDeleteLabel'>Are you sure to delete <strong>{folder.name}</strong> folder?</div>
            <div className='folderControl'>
              <button onClick={(e) => this.handleDeleteConfirmButtonClick(e)} className='primary'>Sure</button>
              <button onClick={(e) => this.handleCancelButtonClick(e)}>Cancel</button>
            </div>
          </div>
        )
      case IDLE:
      default:
        return (
          <div className='FolderRow'>
            <div className='sortBtns'>
              <button onClick={(e) => this.handleUpClick(e)}><i className='fa fa-sort-up fa-fw'/></button>
              <button onClick={(e) => this.handleDownClick(e)}><i className='fa fa-sort-down fa-fw'/></button>
            </div>
            <div className='folderColor'><FolderMark color={folder.color}/></div>
            <div className='folderName'>{folder.name}</div>
            <div className='folderControl'>
              <button onClick={(e) => this.handleEditButtonClick(e)}><i className='fa fa-fw fa-edit'/></button>
              <button onClick={(e) => this.handleDeleteButtonClick(e)}><i className='fa fa-fw fa-close'/></button>
            </div>
          </div>
        )
    }
  }
}

FolderRow.propTypes = {
  folder: PropTypes.shape(),
  index: PropTypes.number,
  count: PropTypes.number,
  setAlert: PropTypes.func
}

FolderRow.prototype.linkState = linkState
