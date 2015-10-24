import React, { PropTypes } from 'react'
import _ from 'lodash'
import linkState from 'boost/linkState'
import api from 'boost/api'

export default class TeamSettingTab extends React.Component {
  constructor (props) {
    super(props)
    let team = this.getCurrentTeam(props)
    this.state = {
      teamName: team != null ? team.profileName : '',
      deleteConfirm: false,
      alert: null
    }
  }

  componentWillReceiveProps (nextProps) {
    let team = this.getCurrentTeam(nextProps)

    this.setState({
      teamName: team != null ? team.profileName : '',
      deleteConfirm: false
    })
  }

  getCurrentTeam (props) {
    if (props == null) props = this.props
    return _.findWhere(props.teams, {id: props.currentTeamId})
  }

  handleTeamSelectChange (e) {
    this.props.switchTeam(e.target.value)
  }

  handleSaveButtonClick (e) {
    let input = {
      profileName: this.state.teamName
    }
    let alert = {
      type: 'info',
      message: 'Sending...'
    }
    this.setState({alert}, () => {
      api.updateTeamInfo(this.props.currentTeamId, input)
        .then(res => {
          console.log(res.body)
          let alert = {
            type: 'success',
            message: 'Successfully done!'
          }
          this.setState({alert})
        })
        .catch(err => {
          var message
          if (err.status != null) {
            message = err.response.body.message
          } else if (err.code === 'ECONNREFUSED') {
            message = 'Can\'t connect to API server.'
          } else throw err

          let alert = {
            type: 'error',
            message: message
          }

          this.setState({alert})
        })
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

    if (team == null || team.userType === 'person') {
      return this.renderNoTeam()
    }

    return (
      <div className='TeamSettingTab content'>
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
          <div className='sectionTitle'>Team profile</div>
          <div className='sectionInput'>
            <label className='label'>Team Name</label>
            <input valueLink={this.linkState('teamName')} type='text'/>
          </div>
          <div className='sectionConfirm'>
            <button onClick={e => this.handleSaveButtonClick(e)}>Save</button>

            {this.state.alert != null
              ? (
                <div className={'alert ' + this.state.alert.type}>{this.state.alert.message}</div>
              )
              : null}
          </div>
        </div>

        {!this.state.deleteConfirm
          ? (
            <div className='section teamDelete'>
              <label>Delete this team</label>
              <button onClick={e => this.setState({deleteConfirm: true})} className='deleteBtn'><i className='fa fa-fw fa-trash'/> Delete</button>
            </div>
          )
          : (
            <div className='section teamDeleteConfirm'>
              <label>Are you sure to delete this team?</label>
              <button onClick={e => this.setState({deleteConfirm: false})}>Cancel</button>
              <button className='deleteBtn'><i className='fa fa-fw fa-check'/> Sure</button>
            </div>
          )}
      </div>
    )
  }

  renderNoTeam () {
    return (
        <div className='TeamSettingTab content'>
          <div className='header'>
            <span>Setting of</span>
            <select
              value={this.props.currentTeamId}
              onChange={e => this.handleTeamSelectChange(e)}
              className='teamSelect'>
              {this.renderTeamOptions()}
            </select>
          </div>
          <div className='section'>Please select a team</div>
        </div>
    )
  }
}

TeamSettingTab.propTypes = {
  currentTeamId: PropTypes.number,
  teams: PropTypes.array,
  switchTeam: PropTypes.func
}

TeamSettingTab.prototype.linkState = linkState
