import React, { PropTypes } from 'react'
import _ from 'lodash'
import FolderRow from './FolderRow'

export default class FolderSettingTab extends React.Component {

  getCurrentTeam (props) {
    if (props == null) props = this.props
    return _.findWhere(props.teams, {id: props.currentTeamId})
  }

  handleTeamSelectChange (e) {
    this.props.switchTeam(e.target.value)
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
