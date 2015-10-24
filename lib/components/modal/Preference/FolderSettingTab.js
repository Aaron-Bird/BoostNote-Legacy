import React, { PropTypes } from 'react'
import _ from 'lodash'
import FolderRow from './FolderRow'
import linkState from 'boost/linkState'
import api from 'boost/api'

export default class FolderSettingTab extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: '',
      public: 0
    }
  }

  getCurrentTeam (props) {
    if (props == null) props = this.props
    return _.findWhere(props.teams, {id: props.currentTeamId})
  }

  handleTeamSelectChange (e) {
    this.props.switchTeam(e.target.value)
  }

  handleFolderPublicChange (e) {
    this.setState({public: e.target.value})
  }

  handleSaveButtonClick (e) {
    let team = this.getCurrentTeam()
    let input = {
      UserId: team.id,
      name: this.state.name,
      public: !!parseInt(this.state.public, 10)
    }

    api.createFolder(input)
      .then(res => {
        console.log(res.body)
        this.setState({
          name: '',
          public: 0
        })
      })
      .catch(err => {
        if (err.status != null) throw err
        else console.error(err)
      })
  }

  renderTeamOptions () {
    return this.props.teams.map(team => {
      return (
        <option key={'team-' + team.id} value={team.id}>{team.name}</option>)
    })
  }

  render () {
    let team = this.getCurrentTeam()
    console.log(team.Folders)
    let folderElements = team.Folders.map(folder => {
      return (
        <FolderRow key={'folder-' + folder.id} folder={folder}/>
        )
    })

    return (
      <div className='FolderSettingTab content'>
        <div className='header'>
          <span>Setting of</span>
          <select
            value={this.props.currentTeamId}
            onChange={e => this.handleTeamSelectChange(e)}
            className='teamSelect'>
            {this.renderTeamOptions()}
          </select>
        </div>
        <div className='section'>
          <div className='sectionTitle'>Folders</div>
          <div className='folderTable'>
            <div className='folderHeader'>
              <div className='folderName'>Folder name</div>
              <div className='folderPublic'>Public/Private</div>
              <div className='folderControl'>Edit/Delete</div>
            </div>
            {folderElements}
            <div className='newFolder'>
              <div className='folderName'>
                <input valueLink={this.linkState('name')} type='text' placeholder='New Folder'/>
              </div>
              <div className='folderPublic'>
                <select value={this.state.public} onChange={e => this.handleFolderPublicChange(e)}>
                  <option value='0'>Private</option>
                  <option value='1'>Public</option>
                </select>
              </div>
              <div className='folderControl'>
                <button onClick={e => this.handleSaveButtonClick(e)} className='primary'>Add</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

FolderSettingTab.propTypes = {
  currentTeamId: PropTypes.number,
  teams: PropTypes.array,
  switchTeam: PropTypes.func
}

FolderSettingTab.prototype.linkState = linkState
