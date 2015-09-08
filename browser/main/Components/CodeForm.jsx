var React = require('react/addons')
var CodeEditor = require('./CodeEditor')
var Select = require('react-select')

var Hq = require('../Services/Hq')

var LinkedState = require('../Mixins/LinkedState')
var KeyCaster = require('../Mixins/KeyCaster')

var PlanetStore = require('../Stores/PlanetStore')

var aceModes = require('../../../modules/ace-modes')

var getOptions = function (input, callback) {
  Hq.searchTag(input)
    .then(function (res) {
      callback(null, {
        options: res.body.map(function (tag) {
          return {
            label: tag.name,
            value: tag.name
          }
        }),
        complete: false
      })
    })
    .catch(function (err) {
      console.log(err)
    })
}

module.exports = React.createClass({
  mixins: [LinkedState, KeyCaster('codeForm')],
  propTypes: {
    planet: React.PropTypes.object,
    close: React.PropTypes.func,
    transitionTo: React.PropTypes.func,
    code: React.PropTypes.object
  },
  getInitialState: function () {
    var code = Object.assign({
      description: '',
      mode: '',
      content: '',
      Tags: []
    }, this.props.code)

    code.Tags = code.Tags.map(function (tag) {
      return {
        label: tag.name,
        value: tag.name
      }
    })

    return {
      code: code
    }
  },
  onKeyCast: function (e) {
    switch (e.status) {
      case 'submitCodeForm':
        this.submit()
        break
      case 'closeModal':
        this.props.close()
        break
    }
  },
  handleModeChange: function (selected) {
    var code = this.state.code
    code.mode = selected
    this.setState({code: code})
  },
  handleTagsChange: function (selected, all) {
    var code = this.state.code
    code.Tags = all
    this.setState({code: code})
  },
  handleContentChange: function (e, value) {
    var code = this.state.code
    code.content = value
    this.setState({code: code})
  },
  submit: function () {
    var planet = this.props.planet
    var code = this.state.code
    code.Tags = code.Tags.map(function (tag) {
      return tag.value
    })
    if (this.props.code == null) {
      Hq.createCode(planet.Owner.name, planet.name, this.state.code)
        .then(function (res) {
          var code = res.body
          PlanetStore.Actions.updateCode(code)
          this.props.close()
          this.props.transitionTo('codes', {userName: planet.Owner.name, planetName: planet.name, localId: code.localId})
        }.bind(this))
        .catch(function (err) {
          console.error(err)
        })
    } else {
      Hq.updateCode(planet.Owner.name, planet.name, this.props.code.localId, this.state.code)
        .then(function (res) {
          var code = res.body
          PlanetStore.Actions.updateCode(code)
          this.props.close()
        }.bind(this))
    }
  },
  handleKeyDown: function (e) {
    if (e.keyCode === 13 && e.metaKey) {
      this.submit()
      e.stopPropagation()
    }
  },
  render: function () {
    var modeOptions = aceModes.map(function (mode) {
      return {
        label: mode,
        value: mode
      }
    })
    return (
      <div className='CodeForm'>
        <div className='modal-body'>
          <div className='form-group'>
            <textarea ref='description' className='codeDescription block-input' valueLink={this.linkState('code.description')} placeholder='Description'/>
          </div>
          <div className='form-group'>
            <Select
              name='mode'
              className='modeSelect'
              value={this.state.code.mode}
              placeholder='Select Language'
              options={modeOptions}
              onChange={this.handleModeChange}/>
          </div>
          <div className='form-group'>
            <CodeEditor onChange={this.handleContentChange} code={this.state.code.content} mode={this.state.code.mode}/>
          </div>
          <div className='form-group'>
            <Select
              name='Tags'
              multi={true}
              allowCreate={true}
              value={this.state.code.Tags}
              placeholder='Tags...'
              asyncOptions={getOptions}
              onChange={this.handleTagsChange}
            />
          </div>
        </div>
        <div className='modal-footer'>
          <div className='modal-control'>
            <button onClick={this.props.close} className='btn-default'>Cancel</button>
            <button onClick={this.submit} className='btn-primary'>{this.props.code == null ? 'Launch' : 'Relaunch'}</button>
          </div>
        </div>
      </div>
    )
  }
})
