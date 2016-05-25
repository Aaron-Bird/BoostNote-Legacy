import React from 'react'
import ReactDOM from 'react-dom'

export default class ContactTab extends React.Component {
  componentDidMount () {
    let titleInput = ReactDOM.findDOMNode(this.refs.title)
    if (titleInput != null) titleInput.focus()
  }

  render () {
    return (
      <div className='ContactTab content'>
        <div className='title'>Contact</div>
        <p>
          - Issues: <a href='https://github.com/BoostIO/Boostnote/issues'>https://github.com/BoostIO/Boostnote/issues</a>
        </p>
      </div>
    )
  }
}
