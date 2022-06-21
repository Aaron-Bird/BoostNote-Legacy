import PropTypes from 'prop-types'
import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './TocPanel.styl'
import eventEmitter from 'browser/main/lib/eventEmitter'
import { generateToc } from 'browser/lib/markdown-toc-generator'

const TocPanel = props => {
  const tocFlatList = generateToc(props.content).tokens.reduce(
    (list, token, line) => {
      if (token.type === 'inline' && token.slug) {
        const title = token.children
          ? token.children
              .filter(i => i.type === 'text')
              .map(i => i.content)
              .join('')
          : ''
        const line = Array.isArray(token.lines) ? token.lines[0] : null
        list.push({
          level: token.lvl,
          title,
          href: token.slug,
          line
        })
      }
      return list
    },
    []
  )

  return (
    <div
      className='tocPanel'
      styleName='control-tocButton-panel'
      style={{ display: 'none' }}
      onClick={e => (e.currentTarget.style.display = 'none')}
    >
      <div
        styleName='control-tocButton-panel-wrapper'
        onClick={e => e.stopPropagation()}
      >
        <div styleName='tocPanel-title'>{props.title}</div>
        <hr />
        <ol styleName='tocPanel-list'>
          {tocFlatList.map((info, index) => (
            <li
              key={info.title + '-' + index}
              style={{ marginLeft: `${(info.level - 1) * 10}px` }}
              onClick={() => {
                eventEmitter.emit('navigation:hash', '#' + info.href, false)
                // eventEmitter.emit('navigation:line', info.line, false)
                eventEmitter.emit('line:jump', info.line, false)
              }}
            >
              {info.title}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

TocPanel.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
}

export default CSSModules(TocPanel, styles)
