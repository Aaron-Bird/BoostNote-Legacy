import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ModeIcon from './ModeIcon'
import modes from '../lib/modes'
import _ from 'lodash'

const IDLE_MODE = 'IDLE_MODE'
const EDIT_MODE = 'EDIT_MODE'

export default class ModeSelect extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      mode: IDLE_MODE,
      search: '',
      focusIndex: 0
    }
  }

  componentDidMount () {
    this.blurHandler = e => {
      let searchElement = ReactDOM.findDOMNode(this.refs.search)
      if (this.state.mode === EDIT_MODE && document.activeElement !== searchElement) {
        this.handleBlur()
      }
    }
    window.addEventListener('click', this.blurHandler)
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.blurHandler)
    let searchElement = ReactDOM.findDOMNode(this.refs.search)
    if (searchElement != null && this.searchKeyDownListener != null) {
      searchElement.removeEventListener('keydown', this.searchKeyDownListener)
    }
  }

  handleIdleSelectClick (e) {
    this.setState({mode: EDIT_MODE, search: this.props.value}, () => {
      ReactDOM.findDOMNode(this.refs.search).select()
    })
  }

  handleModeOptionClick (modeName) {
    return e => {
      this.props.onChange(modeName)
      this.setState({
        mode: IDLE_MODE,
        search: '',
        focusIndex: 0
      })
    }
  }

  handleSearchKeyDown (e) {
    switch (e.keyCode) {
      // up
      case 38:
        e.preventDefault()
        if (this.state.focusIndex > 0) this.setState({focusIndex: this.state.focusIndex - 1})
        break
      // down
      case 40:
        e.preventDefault()
        {
          let search = _.escapeRegExp(this.state.search)
          let filteredModes = modes
            .filter(mode => {
              let nameMatched = mode.name.match(search)
              let aliasMatched = _.some(mode.alias, alias => alias.match(search))
              return nameMatched || aliasMatched
            })
          if (filteredModes.length === this.state.focusIndex + 1) this.setState({focusIndex: filteredModes.length - 1})
          else this.setState({focusIndex: this.state.focusIndex + 1})
        }
        break
      // enter
      case 13:
        e.preventDefault()
        {
          let search = _.escapeRegExp(this.state.search)
          let filteredModes = modes
            .filter(mode => {
              let nameMatched = mode.name.match(search)
              let aliasMatched = _.some(mode.alias, alias => alias.match(search))
              return nameMatched || aliasMatched
            })
          let targetMode = filteredModes[this.state.focusIndex]
          if (targetMode != null) {
            this.props.onChange(targetMode.name)
            this.handleBlur()
          }
        }
        break
      // esc
      case 27:
        e.preventDefault()
        e.stopPropagation()
        this.handleBlur()
        break
    }
    if (this.props.onKeyDown) this.props.onKeyDown(e)
  }

  handleSearchChange (e) {
    this.setState({
      search: e.target.value,
      focusIndex: 0
    })
  }

  handleBlur () {
    if (this.state.mode === EDIT_MODE) {
      this.setState({
        mode: IDLE_MODE,
        search: '',
        focusIndex: 0
      }, function () {
        if (this.props.onBlur) this.props.onBlur()
      })
    }
  }

  render () {
    let className = this.props.className != null
      ? `ModeSelect ${this.props.className}`
      : this.props.className

    if (this.state.mode === IDLE_MODE) {
      let mode = _.findWhere(modes, {name: this.props.value})
      let modeName = mode != null ? mode.name : 'text'

      return (
        <div className={className + ' idle'} onClick={e => this.handleIdleSelectClick(e)}>
          <ModeIcon mode={modeName}/>{mode.label}
        </div>
      )
    }

    let search = _.escapeRegExp(this.state.search)
    let filteredOptions = modes
      .filter(mode => {
        let nameMatched = mode.name.match(search)
        let aliasMatched = _.some(mode.alias, alias => alias.match(search))
        return nameMatched || aliasMatched
      })
      .map((mode, index) => {
        return (
          <div key={mode.name} className={index === this.state.focusIndex ? 'ModeSelect-options-item active' : 'ModeSelect-options-item'} onClick={e => this.handleModeOptionClick(mode.name)(e)}><ModeIcon mode={mode.name}/>{mode.label}</div>
          )
      })

    return (
      <div className={className + ' edit'}>
        <input onBlur={e => this.handleBlur(e)} onKeyDown={e => this.handleSearchKeyDown(e)} ref='search' onChange={e => this.handleSearchChange(e)} value={this.state.search} type='text'/>
        <div ref='options' className='ModeSelect-options hide'>
          {filteredOptions}
        </div>
      </div>
    )
  }
}

ModeSelect.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onBlur: PropTypes.func
}
