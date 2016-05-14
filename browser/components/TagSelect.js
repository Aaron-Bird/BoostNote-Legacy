import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

function isNotEmptyString (str) {
  return _.isString(str) && str.length > 0
}

export default class TagSelect extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      input: '',
      isInputFocused: false
    }
  }

  componentDidMount () {
    this.blurInputBlurHandler = e => {
      if (ReactDOM.findDOMNode(this.refs.tagInput) !== document.activeElement) {
        this.setState({isInputFocused: false})
      }
    }
    window.addEventListener('click', this.blurInputBlurHandler)
  }

  componentWillUnmount (e) {
    window.removeEventListener('click', this.blurInputBlurHandler)
  }

  // Suggestは必ずInputの下に位置するようにする
  componentDidUpdate () {
    if (this.shouldShowSuggest()) {
      let inputRect = ReactDOM.findDOMNode(this.refs.tagInput).getBoundingClientRect()
      let suggestElement = ReactDOM.findDOMNode(this.refs.suggestTags)
      if (suggestElement != null) {
        suggestElement.style.top = inputRect.top + 20 + 'px'
        suggestElement.style.left = inputRect.left + 'px'
      }
    }
  }

  shouldShowSuggest () {
    return this.state.isInputFocused && isNotEmptyString(this.state.input)
  }

  addTag (tag, clearInput = true) {
    let tags = this.props.tags.slice(0)
    let newTag = tag.trim()

    if (newTag.length === 0 && clearInput) {
      this.setState({input: ''})
      return
    }

    tags.push(newTag)
    tags = _.uniq(tags)

    if (_.isFunction(this.props.onChange)) {
      this.props.onChange(newTag, tags)
    }
    if (clearInput) this.setState({input: ''})
  }

  handleKeyDown (e) {
    switch (e.keyCode) {
      case 8:
        {
          if (this.state.input.length > 0) break
          e.preventDefault()

          let tags = this.props.tags.slice(0)
          tags.pop()

          this.props.onChange(null, tags)
        }
        break
      case 13:
        {
          e.preventDefault()
          this.addTag(this.state.input)
        }
    }
  }

  handleThisClick (e) {
    ReactDOM.findDOMNode(this.refs.tagInput).focus()
  }

  handleInputFocus (e) {
    this.setState({isInputFocused: true})
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

  handleSuggestClick (tag) {
    return e => {
      this.addTag(tag)
    }
  }

  render () {
    let { tags, suggestTags } = this.props

    let tagElements = _.isArray(tags)
      ? this.props.tags.map(tag => (
        <div key={tag} className='TagSelect-tags-item'>
          <button onClick={e => this.handleItemRemoveButton(tag)(e)} className='TagSelect-tags-item-remove'><i className='fa fa-fw fa-times'/></button>
          <div className='TagSelect-tags-item-label'>{tag}</div>
        </div>))
      : null

    let suggestElements = this.shouldShowSuggest() ? suggestTags
        .filter(tag => {
          return tag.match(this.state.input)
        })
        .map(tag => {
          return <button onClick={e => this.handleSuggestClick(tag)(e)} key={tag}>{tag}</button>
        })
      : null

    return (
      <div className='TagSelect' onClick={e => this.handleThisClick(e)}>
        <div className='TagSelect-tags'>
          {tagElements}
          <input
            type='text'
            onKeyDown={e => this.handleKeyDown(e)}
            ref='tagInput'
            valueLink={this.linkState('input')}
            placeholder='Click here to add tags'
            className='TagSelect-input'
            onFocus={e => this.handleInputFocus(e)}
          />
        </div>
        {suggestElements != null && suggestElements.length > 0
          ? (
            <div ref='suggestTags' className='TagSelect-suggest'>
              {suggestElements}
            </div>
          )
          : null
        }
      </div>
    )
  }
}

TagSelect.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  suggestTags: PropTypes.array
}
