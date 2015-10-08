var React = require('react')
var Select = require('react-select')

var Hq = require('../Services/Hq')

var LinkedState = require('../Mixins/LinkedState')
var Markdown = require('../Mixins/Markdown')
var KeyCaster = require('../Mixins/KeyCaster')

var PlanetStore = require('../Stores/PlanetStore')

var CodeEditor = require('./CodeEditor')
var MarkdownPreview = require('./MarkdownPreview')

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

var EDIT_MODE = 0
var PREVIEW_MODE = 1

module.exports = React.createClass({
  mixins: [LinkedState, Markdown, KeyCaster('noteForm')],
  propTypes: {
    planet: React.PropTypes.object,
    close: React.PropTypes.func,
    transitionTo: React.PropTypes.func,
    note: React.PropTypes.object
  },
  getInitialState: function () {
    var note = Object.assign({
      title: '',
      content: '',
      Tags: []
    }, this.props.note)
    note.Tags = note.Tags.map(function (tag) {
      return {
        label: tag.name,
        value: tag.name
      }
    })
    return {
      note: note,
      mode: EDIT_MODE
    }
  },
  onKeyCast: function (e) {
    switch (e.status) {
      case 'submitNoteForm':
        this.submit()
        break
      case 'closeModal':
        this.props.close()
        break
    }
  },
  handleTagsChange: function (selected, all) {
    var note = this.state.note
    note.Tags = all
    this.setState({note: note})
  },
  handleContentChange: function (e, value) {
    var note = this.state.note
    note.content = value
    this.setState({note: note})
  },
  togglePreview: function () {
    this.setState({mode: this.state.mode === EDIT_MODE ? PREVIEW_MODE : EDIT_MODE})
  },
  submit: function () {
    var planet = this.props.planet
    var note = this.state.note
    note.Tags = note.Tags.map(function (tag) {
      return tag.value
    })

    if (this.props.note == null) {
      Hq.createNote(planet.Owner.name, planet.name, this.state.note)
        .then(function (res) {
          var note = res.body
          PlanetStore.Actions.updateNote(note)
          this.props.close()
          this.props.transitionTo('notes', {userName: planet.Owner.name, planetName: planet.name, localId: note.localId})
        }.bind(this))
        .catch(function (err) {
          console.error(err)
        })
    } else {
      Hq.updateNote(planet.Owner.name, planet.name, this.props.note.localId, this.state.note)
        .then(function (res) {
          var note = res.body
          PlanetStore.Actions.updateNote(note)
          this.props.close()
        }.bind(this))
    }
  },
  render: function () {
    var content = this.state.mode === EDIT_MODE ? (
      <div className='form-group'>
        <CodeEditor onChange={this.handleContentChange} code={this.state.note.content} mode={'markdown'}/>
      </div>
    ) : (
      <div className='form-group relative'>
        <div className='previewMode'>Preview mode</div>
        <MarkdownPreview className='marked' content={this.state.note.content}/>
      </div>
    )

    return (
      <div className='NoteForm'>
        <div className='modal-body'>
          <div className='form-group'>
            <input ref='title' className='block-input' valueLink={this.linkState('note.title')} placeholder='Title'/>
          </div>
          {content}
          <div className='form-group'>
            <Select
                name='Tags'
                multi={true}
                allowCreate={true}
                value={this.state.note.Tags}
                placeholder='Tags...'
                asyncOptions={getOptions}
                onChange={this.handleTagsChange}
            />
          </div>
        </div>

        <div className='modal-footer'>
          <button onClick={this.togglePreview} className={'btn-default' + (this.state.mode === PREVIEW_MODE ? ' active' : '')}>Preview mode</button>
          <div className='modal-control'>
            <button onClick={this.props.close} className='btn-default'>Cancel</button>
            <button onClick={this.submit} className='btn-primary'>Launch</button>
          </div>
        </div>
      </div>
    )
  }
})
