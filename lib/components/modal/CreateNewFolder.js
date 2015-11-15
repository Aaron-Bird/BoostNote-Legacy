import React, { PropTypes } from 'react'
import linkState from 'boost/linkState'
import { createFolder } from 'boost/actions'
import store from 'boost/store'
import FolderMark from 'boost/components/FolderMark'

export default class CreateNewFolder extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      color: Math.round(Math.random() * 7),
      alert: null
    }
  }

  handleCloseButton (e) {
    this.props.close()
  }

  handleConfirmButton (e) {
    this.setState({alert: null}, () => {
      let { close } = this.props
      let { name, color } = this.state

      let input = {
        name,
        color
      }

      try {
        store.dispatch(createFolder(input))
      } catch (e) {
        this.setState({alert: {
          type: 'error',
          message: e.message
        }})
        return
      }
      close()
    })
  }

  handleColorClick (colorIndex) {
    return e => {
      this.setState({
        color: colorIndex
      })
    }
  }

  render () {
    let alert = this.state.alert
    let alertElement = alert != null ? (
        <p className={`alert ${alert.type}`}>
          {alert.message}
        </p>
      ) : null
    let colorIndexes = []
    for (let i = 0; i < 8; i++) {
      colorIndexes.push(i)
    }
    let colorElements = colorIndexes.map(index => {
      let className = index === this.state.color
        ? 'active'
        : null

      return (
        <span className='option' key={index} onClick={e => this.handleColorClick(index)(e)}>
          <FolderMark className={className} color={index}/>
        </span>
      )
    })

    return (
      <div className='CreateNewFolder modal'>
        <button onClick={e => this.handleCloseButton(e)} className='closeBtn'><i className='fa fa-fw fa-times'/></button>

        <div className='title'>Create new folder</div>

        <input className='ipt' type='text' valueLink={this.linkState('name')} placeholder='Enter folder name'/>
        <div className='colorSelect'>
          {colorElements}
        </div>
        {alertElement}

        <button onClick={e => this.handleConfirmButton(e)} className='confirmBtn'>Create</button>
      </div>
    )
  }
}

CreateNewFolder.propTypes = {
  close: PropTypes.func
}

CreateNewFolder.prototype.linkState = linkState
