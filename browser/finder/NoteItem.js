import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NoteItem.styl'
import moment from 'moment'
import _ from 'lodash'

class NoteItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  handleClick (e) {
    this.props.onClick(e)
  }

  render () {
    let { note, folder, storage, isActive } = this.props

    let tagList = _.isArray(note.tags)
      ? note.tags.map((tag) => {
        return (
          <span styleName='bottom-tagList-item'
            key={tag}>
            {tag}
          </span>
        )
      })
      : []
    return (
      <div styleName={isActive
          ? 'root--active'
          : 'root'
        }
        key={note.storage + '-' + note.key}
        onClick={(e) => this.handleClick(e)}
      >
        <div styleName='info'>
          <div styleName='info-left'>
            <span styleName='info-left-folder'
              style={{borderColor: folder.color}}
            >
              {folder.name}
              <span styleName='info-left-folder-surfix'>in {storage.name}</span>
            </span>
          </div>
        </div>

        <div styleName='title'>
          {note.type === 'SNIPPET_NOTE'
            ? <i styleName='title-icon' className='fa fa-fw fa-code'/>
            : <i styleName='title-icon' className='fa fa-fw fa-file-text-o'/>
          }
          {note.title.trim().length > 0
            ? note.title
            : <span styleName='title-empty'>Empty</span>
          }
        </div>

        <div styleName='bottom'>
          <i styleName='bottom-tagIcon'
            className='fa fa-tags fa-fw'
          />
          <div styleName='bottom-tagList'>
            {tagList.length > 0
              ? tagList
              : <span styleName='bottom-tagList-empty'>Not tagged yet</span>
            }
          </div>

          <div styleName='bottom-time'>
            {moment(note.updatedAt).fromNow()}
          </div>
        </div>
      </div>
    )
  }
}

NoteItem.propTypes = {
}

export default CSSModules(NoteItem, styles)
