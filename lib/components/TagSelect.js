import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import linkState from 'boost/linkState'

export default class TagSelect extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      input: ''
    }
  }

  handleKeyDown (e) {
    if (e.keyCode !== 13) return false
    e.preventDefault()

    let tags = this.props.tags.slice(0)
    let newTag = this.state.input

    tags.push(newTag)
    tags = _.uniq(tags)

    if (_.isFunction(this.props.onChange)) {
      this.props.onChange(newTag, tags)
    }
    this.setState({input: ''})
  }

  handleThisClick (e) {
    ReactDOM.findDOMNode(this.refs.tagInput).focus()
  }

  handleItemRemoveButton (tag) {
    return e => {
      e.stopPropagation()

      let tags = this.props.tags.slice(0)
      tags.splice(tags.indexOf(tag), 1)

      if (_.isFunction(this.props.onChange)) {
        this.props.onChange(null, tags)
      }
    }
  }

  render () {
    var tagElements = _.isArray(this.props.tags)
      ? this.props.tags.map(tag => (
        <span key={tag} className='tagItem'>
          <button onClick={e => this.handleItemRemoveButton(tag)(e)} className='tagRemoveBtn'><i className='fa fa-fw fa-times'/></button>
          <span className='tagLabel'>{tag}</span>
        </span>))
      : null

    return (
      <div className='TagSelect' onClick={e => this.handleThisClick(e)}>
        {tagElements}
        <input
          type='text'
          onKeyDown={e => this.handleKeyDown(e)}
          ref='tagInput'
          valueLink={this.linkState('input')}
          placeholder='new tag'
          className='tagInput'/>
      </div>
    )
  }
}

TagSelect.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func
}

TagSelect.prototype.linkState = linkState
