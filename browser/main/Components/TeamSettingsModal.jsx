/* global localStorage */

var React = require('react/addons')
var Reflux = require('reflux')
var Select = require('react-select')

var Hq = require('../Services/Hq')

var LinkedState = require('../Mixins/LinkedState')
var Helper = require('../Mixins/Helper')
var KeyCaster = require('../Mixins/KeyCaster')

var UserStore = require('../Stores/UserStore')

var getOptions = function (input, callback) {
  Hq.searchUser(input)
    .then(function (res) {
      callback(null, {
        options: res.body.map(function (user) {
          return {
            label: user.name,
            value: user.name
          }
        }),
        complete: false
      })
    })
    .catch(function (err) {
      console.error(err)
    })
}

module.exports = React.createClass({
  mixins: [LinkedState, Reflux.listenTo(UserStore, 'onUserChange'), Helper, KeyCaster('teamSettingsModal')],
  propTypes: {
    team: React.PropTypes.shape({
      id: React.PropTypes.number,
      name: React.PropTypes.string,
      profileName: React.PropTypes.string,
      email: React.PropTypes.string,
      Members: React.PropTypes.array
    }),
    close: React.PropTypes.func
  },
  getInitialState: function () {
    var team = this.props.team
    return {
      currentTab: 'teamInfo',
      team: {
        profileName: team.profileName
      },
      userSubmitStatus: null,
      member: {
        name: '',
        role: 'member'
      },
      updatingMember: false
    }
  },
  onKeyCast: function (e) {
    switch (e.status) {
      case 'closeModal':
        this.props.close()
        break
    }
  },
  onUserChange: function (res) {
    var member
    switch (res.status) {
      case 'memberAdded':
        member = res.data
        if (member.TeamMember.TeamId === this.props.team.id) {
          this.forceUpdate()
        }
        break
      case 'memberRemoved':
        member = res.data
        if (member.TeamMember.TeamId === this.props.team.id) {
          this.forceUpdate()
        }
        break
    }
  },
  selectTab: function (tabName) {
    return function () {
      this.setState({currentTab: tabName})
    }.bind(this)
  },
  saveUserInfo: function () {
    this.setState({
      userSubmitStatus: 'sending'
    }, function () {
      Hq.updateUser(this.props.team.name, this.state.team)
        .then(function (res) {
          this.setState({userSubmitStatus: 'done'}, function () {
            UserStore.Actions.update(res.body)
            this.forceUpdate()
          })
        }.bind(this))
        .catch(function (err) {
          console.error(err)
          this.setState({userSubmitStatus: 'error'})
        }.bind(this))
    })
  },
  handleMemberNameChange: function (value) {
    var member = this.state.member
    member.name = value
    this.setState({member: member})
  },
  addMember: function () {
    this.setState({updatingMember: true}, function () {
      Hq
        .addMember(this.props.team.name, {
          userName: this.state.member.name,
          role: this.state.member.role
        })
        .then(function (res) {
          UserStore.Actions.addMember(res.body)
          this.setState({updatingMember: false})
        }.bind(this))
        .catch(function (err) {
          console.error(err)
          this.setState({updatingMember: false})
        }.bind(this))
    })
  },
  roleChange: function (memberName) {
    return function (e) {
      var role = e.target.value
      this.setState({updatingMember: true}, function () {
        Hq
          .addMember(this.props.team.name, {
            userName: memberName,
            role: role
          })
          .then(function (res) {
            UserStore.Actions.addMember(res.body)
            this.setState({updatingMember: false})
          }.bind(this))
          .catch(function (err) {
            console.error(err)
            this.setState({updatingMember: false})
          }.bind(this))
      })
    }.bind(this)
  },
  removeMember: function (memberName) {
    return function () {
      this.setState({updatingMember: true}, function () {
        Hq
          .removeMember(this.props.team.name, {
            userName: memberName
          })
          .then(function (res) {
            UserStore.Actions.removeMember(res.body)
            this.setState({updatingMember: false})
          }.bind(this))
          .catch(function (err) {
            console.error(err)
            this.setState({updatingMember: false})
          }.bind(this))
      })
    }.bind(this)
  },
  render: function () {
    var content

    switch (this.state.currentTab) {
      case 'teamInfo':
        content = this.renderTeamInfoTab()
        break
      case 'members':
        content = this.renderMembersTab()
        break
    }

    return (
      <div className='TeamSettingsModal modal tabModal'>
        <div className='leftPane'>
          <div className='tabLabel'>Team settings</div>
          <div className='tabList'>
            <button className={this.state.currentTab === 'teamInfo' ? 'active' : ''} onClick={this.selectTab('teamInfo')}><i className='fa fa-info-circle fa-fw'/> Team Info</button>
            <button className={this.state.currentTab === 'members' ? 'active' : ''} onClick={this.selectTab('members')}><i className='fa fa-users fa-fw'/> Members</button>
          </div>
        </div>
        <div className='rightPane'>
          {content}
        </div>
      </div>
    )
  },
  renderTeamInfoTab: function () {
    return (
      <div className='userInfoTab'>
        <div className='formField'>
          <label>Profile Name</label>
          <input valueLink={this.linkState('team.profileName')}/>
        </div>
        <div className='formConfirm'>
          <button disabled={this.state.userSubmitStatus === 'sending'} onClick={this.saveUserInfo}>Save</button>

          <div className={'alertInfo' + (this.state.userSubmitStatus === 'sending' ? '' : ' hide')}>on Sending...</div>

          <div className={'alertError' + (this.state.userSubmitStatus === 'error' ? '' : ' hide')}>Connection failed.. Try again.</div>

          <div className={'alertSuccess' + (this.state.userSubmitStatus === 'done' ? '' : ' hide')}>Successfully done!!</div>
        </div>
      </div>
    )
  },
  renderMembersTab: function () {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'))

    var members = this.props.team.Members.map(function (member) {
      var isCurrentUser = currentUser.id === member.id
      return (
        <tr>
          <td>{member.profileName}({member.name})</td>
          <td>
            {isCurrentUser ? (
              'Owner'
              ) : (
                <select disabled={this.state.updatingMember} onChange={this.roleChange(member.name)} className='roleSelect' value={member.TeamMember.role}>
                  <option value='owner'>Owner</option>
                  <option value='member'>Member</option>
                </select>
              )}
          </td>
          <td>
            {isCurrentUser ? '-' : (
              <button disabled={this.state.updatingMember} onClick={this.removeMember(member.name)}><i className='fa fa-close fa-fw'/></button>
            )}
          </td>
        </tr>
      )
    }.bind(this))

    var belowLimit = members.length < 5

    return (
      <div className='membersTab'>
        <table className='memberTable'>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Control</th>
            </tr>
          </thead>
          <tbody>
            {members}
          </tbody>
        </table>
        {belowLimit ? (
          <div className='addMemberForm'>
            <div className='formLabel'>Add Member</div>
            <div className='formGroup'>
              <Select
                name='userName'
                value={this.state.member.name}
                placeholder='Username to add'
                asyncOptions={getOptions}
                onChange={this.handleMemberNameChange}
                className='userNameSelect'
              />
            <select valueLink={this.linkState('member.role')} className='roleSelect'>
                <option value={'member'}>Member</option>
                <option value={'owner'}>Owner</option>
              </select>
              <button disabled={this.state.updatingMember} onClick={this.addMember} className='confirmButton'>Add Member</button>
            </div>
          </div>
        ) : (
          <div>
            Maximum number of members is 5 on Beta version. Please contact us if you want futher use.
          </div>
        )}
      </div>
    )
  }
})
