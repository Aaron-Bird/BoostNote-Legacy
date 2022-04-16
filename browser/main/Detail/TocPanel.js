import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './TocPanel.styl'
import i18n from 'browser/lib/i18n'
import uslug from 'uslug'
import toc from 'markdown-toc'
import eventEmitter from 'browser/main/lib/eventEmitter'

const TocPanel = (props) => {
  const contentSplit = props.content.split('\n')
  const tocFlatList = contentSplit.reduce((list, str, line) => {
    str = str.trim()
    const reg = /^(#+)(.*?)$/
    if (reg.test(str)) {
      const matched = str.match(reg)
      const title = matched[2].trim().replace(/:.*?:/, '')
      list.push({
        level: matched[1].length,
        title: title,
        href: uslug(title, { lower: false }),
        line
      })
    }
    return list
  }, [])

  return (
    <div
      className='tocPanel'
      styleName='control-tocButton-panel'
      style={{ display: 'none' }}
      onClick={(e) => e.currentTarget.style.display = 'none'}
    >
      <div
        styleName='control-tocButton-panel-wrapper'
        onClick={(e) => e.stopPropagation()}
      >
        <div styleName='tocPanel-title'>{props.title}</div>
        <hr />
        <ol styleName='tocPanel-list'>
          {
            tocFlatList.map((info, index) => (
              <li
                key={info.title + '-' + index}
                style={{ 'marginLeft': `${(info.level - 1) * 10}px` }}
                onClick={() => {
                  eventEmitter.emit('navigation:hash', '#' + info.href)
                  eventEmitter.emit('line:jump', info.line)
                }}
              >
                {info.title}
              </li>
            ))
          }
        </ol>
      </div>
    </div>
  )
}

TocPanel.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
}

export default CSSModules(TocPanel, styles)