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
    this.setState({mode: EDIT_MODE})
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.mode !== this.state.mode && this.state.mode === EDIT_MODE) {
      let searchElement = ReactDOM.findDOMNode(this.refs.search)
      searchElement.focus()
      if (this.searchKeyDownListener == null) {
        this.searchKeyDownListener = e => this.handleSearchKeyDown
      }
      searchElement.addEventListener('keydown', this.searchKeyDownListener)
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextProps.mode !== this.state.mode && nextState.mode === IDLE_MODE) {
      let searchElement = ReactDOM.findDOMNode(this.refs.search)
      if (searchElement != null && this.searchKeyDownListener != null) {
        searchElement.removeEventListener('keydown', this.searchKeyDownListener)
      }
    }
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
          let filteredModes = modes
            .filter(mode => {
              let search = this.state.search
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
          let filteredModes = modes
            .filter(mode => {
              let search = this.state.search
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
      case 9:
        this.handleBlur()
    }
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
      })
    }
    if (this.props.onBlur != null) this.props.onBlur()
  }

  render () {
    let className = this.props.className != null
      ? `ModeSelect ${this.props.className}`
      : this.props.className

    if (this.state.mode === IDLE_MODE) {
      let mode = _.findWhere(modes, {name: this.props.value})
      let modeName = mode != null ? mode.name : 'text'
      let modeLabel = mode != null ? mode.label : 'Plain text'

      return (
        <div className={className + ' idle'} onClick={e => this.handleIdleSelectClick(e)}>
          <ModeIcon mode={modeName}/>
          <span className='modeLabel'>{modeLabel}</span>
        </div>
      )
    }

    let filteredOptions = modes
      .filter(mode => {
        let search = this.state.search
        let nameMatched = mode.name.match(_.escapeRegExp(search))
        let aliasMatched = _.some(mode.alias, alias => alias.match(_.escapeRegExp(search)))
        return nameMatched || aliasMatched
      })
      .map((mode, index) => {
        return (
          <div key={mode.name} className={index === this.state.focusIndex ? 'option active' : 'option'} onClick={e => this.handleModeOptionClick(mode.name)(e)}><ModeIcon mode={mode.name}/>{mode.label}</div>
          )
      })

    return (
      <div className={className + ' edit'}>
        <input onKeyDown={e => this.handleSearchKeyDown(e)} ref='search' onChange={e => this.handleSearchChange(e)} value={this.state.search} type='text'/>
        <div ref='options' className='modeOptions hide'>
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
  onBlur: PropTypes.func
}
