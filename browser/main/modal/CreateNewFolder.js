import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import linkState from 'browser/lib/linkState'
import store from '../store'
import FolderMark from 'browser/components/FolderMark'

export default class CreateNewFolder extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      color: Math.round(Math.random() * 7),
      alert: null
    }
  }

  componentDidMount () {
    ReactDOM.findDOMNode(this.refs.folderName).focus()
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
        // store.dispatch(createFolder(input))
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
    return (e) => {
      this.setState({
        color: colorIndex
      })
    }
  }

  handleKeyDown (e) {
    if (e.keyCode === 13) {
      this.handleConfirmButton()
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
    let colorElements = colorIndexes.map((index) => {
      let className = 'option'
      if (index === this.state.color) className += ' active'

      return (
        <span className={className} key={index} onClick={(e) => this.handleColorClick(index)(e)}>
          <FolderMark color={index}/>
        </span>
      )
    })

    return (
      <div className='CreateNewFolder modal'>
        <button onClick={(e) => this.handleCloseButton(e)} className='closeBtn'><i className='fa fa-fw fa-times'/></button>

        <div className='title'>Create new folder</div>

        <input ref='folderName' onKeyDown={(e) => this.handleKeyDown(e)} className='ipt' type='text' valueLink={this.linkState('name')} placeholder='Enter folder name'/>
        <div className='colorSelect'>
          {colorElements}
        </div>
        {alertElement}

        <button onClick={(e) => this.handleConfirmButton(e)} className='confirmBtn'>Create</button>
      </div>
    )
  }
}

CreateNewFolder.propTypes = {
  close: PropTypes.func
}

CreateNewFolder.prototype.linkState = linkState
