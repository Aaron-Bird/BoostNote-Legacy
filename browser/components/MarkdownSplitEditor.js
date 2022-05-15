import React from 'react'
import CodeEditor from 'browser/components/CodeEditor'
import MarkdownPreview from 'browser/components/MarkdownPreview'
import { findStorage } from 'browser/lib/findStorage'
import _ from 'lodash'

import styles from './MarkdownSplitEditor.styl'
import CSSModules from 'browser/lib/CSSModules'

const TOP_OFFSET = 20

class MarkdownSplitEditor extends React.Component {
  constructor(props) {
    super(props)
    this.value = props.value
    this.focus = () => this.refs.code.focus()
    this.reload = () => this.refs.code.reload()
    this.userScroll = props.config.preview.scrollSync
    this.state = {
      isSliderFocused: false,
      codeEditorWidthInPercent: 50,
      codeEditorHeightInPercent: 50
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.config.preview.scrollSync !==
      prevProps.config.preview.scrollSync
    ) {
      this.userScroll = this.props.config.preview.scrollSync
    }
  }

  handleCursorActivity(editor) {
    if (this.userScroll) {
      const previewDoc = _.get(
        this,
        'refs.preview.refs.root.contentWindow.document'
      )
      const previewScrollTop = _.get(previewDoc, 'body.scrollTop')
      const codeCursor = editor.doc.getCursor()
      const codeCursorCoords = editor.charCoords(
        { line: codeCursor.line, ch: 0 },
        'local'
      )
      const codeDoc = _.get(this, 'refs.code.editor.doc')
      const codeScrollTop = codeDoc.cm.getScrollInfo().top
      const codeTop = codeCursorCoords.top - codeScrollTop

      const blocks = previewDoc.querySelectorAll('body [data-line]')
      if (!blocks.length) retun

      const codeLine = codeCursor.line
      let index = 0
      while (index < blocks.length) {
        const block = blocks[index]
        const blockLine = parseInt(block.getAttribute('data-line'))
        if (blockLine < codeLine) {
          index++
        } else {
          if (blockLine > codeLine && index > 0) {
            index--
          }
          break
        }
      }
      const block = blocks[index]
      if (!block) return

      const previewPageYOffset = _.get(
        this,
        'refs.preview.refs.root.contentWindow.pageYOffset'
      )

      const blockRect = block.getBoundingClientRect()
      const top = previewPageYOffset + blockRect.top

      if (typeof top === 'number' || !Number.isNaN(top)) {
        this.scrollTo(previewScrollTop, top - codeTop, y =>
          _.set(previewDoc, 'body.scrollTop', y)
        )
      }
    }
  }

  setValue(value) {
    this.refs.code.setValue(value)
  }

  handleOnChange(e) {
    this.value = this.refs.code.value
    this.props.onChange(e)
  }

  handleEditorScroll(e) {
    if (this.userScroll) {
      const previewDoc = _.get(
        this,
        'refs.preview.refs.root.contentWindow.document'
      )
      const previewScrollTop = _.get(previewDoc, 'body.scrollTop')
      const codeDoc = _.get(this, 'refs.code.editor.doc')
      const editorScrollTop = codeDoc.cm.getScrollInfo().top

      const codeLine = codeDoc.cm.coordsChar(
        {
          left: 0,
          top: editorScrollTop + TOP_OFFSET
        },
        'local'
      ).line

      const blocks = previewDoc.querySelectorAll('body [data-line]')
      if (!blocks.length) return

      let index = 0
      while (index < blocks.length) {
        const block = blocks[index]
        const blockLine = parseInt(block.getAttribute('data-line'))
        if (blockLine < codeLine) {
          index++
        } else {
          if (blockLine > codeLine && index > 0) {
            index--
          }
          break
        }
      }
      const block = blocks[index]
      if (!block) return

      const previewPageYOffset = _.get(
        this,
        'refs.preview.refs.root.contentWindow.pageYOffset'
      )
      const blockRect = block.getBoundingClientRect()
      const top = previewPageYOffset + blockRect.top
      if (typeof top === 'number' || !Number.isNaN(top)) {
        this.scrollTo(previewScrollTop, top, y =>
          _.set(previewDoc, 'body.scrollTop', y)
        )
      }
    }
  }

  handlePreviewScroll(e) {
    if (this.userScroll) {
      const previeWindow = this.refs.preview.getWindow()
      const blocks = previeWindow.document.body.querySelectorAll(
        'body [data-line]'
      )
      if (!blocks.length) return

      let index = 0
      while (index < blocks.length) {
        const blockRect = blocks[index].getBoundingClientRect()
        if (blockRect.top < TOP_OFFSET) {
          index++
        } else {
          if (blockRect.top > TOP_OFFSET && index > 0) {
            index--
          }
          break
        }
      }

      const block = blocks[index]
      if (!block) return

      const line = parseInt(block.getAttribute('data-line'))
      const editor = _.get(this, 'refs.code.editor')
      const codeScrollTop = _.get(editor.doc, 'scrollTop')
      const top = editor.charCoords({ line: line, ch: 0 }, 'local').top
      if (typeof top === 'number' || !Number.isNaN(top)) {
        this.scrollTo(codeScrollTop, top, y => editor.doc.cm.scrollTo(0, y))
      }
    }
  }

  handleCheckboxClick(e) {
    e.preventDefault()
    e.stopPropagation()
    const idMatch = /checkbox-([0-9]+)/
    const checkedMatch = /^(\s*>?)*\s*[+\-*] \[x]/i
    const uncheckedMatch = /^(\s*>?)*\s*[+\-*] \[ ]/
    const checkReplace = /\[x]/i
    const uncheckReplace = /\[ ]/
    if (idMatch.test(e.target.getAttribute('id'))) {
      const lineIndex =
        parseInt(e.target.getAttribute('id').match(idMatch)[1], 10) - 1
      const lines = this.refs.code.value.split('\n')

      const targetLine = lines[lineIndex]
      let newLine = targetLine

      if (targetLine.match(checkedMatch)) {
        newLine = targetLine.replace(checkReplace, '[ ]')
      }
      if (targetLine.match(uncheckedMatch)) {
        newLine = targetLine.replace(uncheckReplace, '[x]')
      }
      this.refs.code.setLineContent(lineIndex, newLine)
    }
  }

  handleMouseMove(e) {
    if (this.state.isSliderFocused) {
      const rootRect = this.refs.root.getBoundingClientRect()
      if (this.props.isStacking) {
        const rootHeight = rootRect.height
        const offset = rootRect.top
        let newCodeEditorHeightInPercent =
          ((e.pageY - offset) / rootHeight) * 100

        // limit minSize to 10%, maxSize to 90%
        if (newCodeEditorHeightInPercent <= 10) {
          newCodeEditorHeightInPercent = 10
        }

        if (newCodeEditorHeightInPercent >= 90) {
          newCodeEditorHeightInPercent = 90
        }

        this.setState({
          codeEditorHeightInPercent: newCodeEditorHeightInPercent
        })
      } else {
        const rootWidth = rootRect.width
        const offset = rootRect.left
        let newCodeEditorWidthInPercent = ((e.pageX - offset) / rootWidth) * 100

        // limit minSize to 10%, maxSize to 90%
        if (newCodeEditorWidthInPercent <= 10) {
          newCodeEditorWidthInPercent = 10
        }

        if (newCodeEditorWidthInPercent >= 90) {
          newCodeEditorWidthInPercent = 90
        }

        this.setState({
          codeEditorWidthInPercent: newCodeEditorWidthInPercent
        })
      }
    }
  }

  handleMouseUp(e) {
    e.preventDefault()
    this.setState({
      isSliderFocused: false
    })
  }

  handleMouseDown(e) {
    e.preventDefault()
    this.setState({
      isSliderFocused: true
    })
  }

  scrollTo(from, to, scroller) {
    const distance = to - from
    const framerate = 1000 / 60
    const frames = 20
    const refractory = frames * framerate

    this.userScroll = false

    let frame = 0
    let scrollPos, time
    const timer = setInterval(() => {
      time = frame / frames
      scrollPos =
        time < 0.5
          ? 2 * time * time // ease in
          : -1 + (4 - 2 * time) * time // ease out

      scroller(from + scrollPos * distance)

      if (frame >= frames) {
        clearInterval(timer)
        setTimeout(() => {
          this.userScroll = true
        }, refractory)
      }
      frame++
    }, framerate)
  }

  render() {
    const {
      config,
      value,
      storageKey,
      noteKey,
      linesHighlighted,
      getNote,
      isStacking,
      RTL
    } = this.props
    let storage
    try {
      storage = findStorage(storageKey)
    } catch (e) {
      return <div />
    }

    let editorStyle = {}
    let previewStyle = {}
    let sliderStyle = {}

    let editorFontSize = parseInt(config.editor.fontSize, 10)
    if (!(editorFontSize > 0 && editorFontSize < 101)) editorFontSize = 14
    editorStyle.fontSize = editorFontSize

    let editorIndentSize = parseInt(config.editor.indentSize, 10)
    if (!(editorStyle.fontSize > 0 && editorStyle.fontSize < 132))
      editorIndentSize = 4
    editorStyle.indentSize = editorIndentSize

    editorStyle = Object.assign(
      editorStyle,
      isStacking
        ? {
            width: '100%',
            height: `${this.state.codeEditorHeightInPercent}%`
          }
        : {
            width: `${this.state.codeEditorWidthInPercent}%`,
            height: '100%'
          }
    )

    previewStyle = Object.assign(
      previewStyle,
      isStacking
        ? {
            width: '100%',
            height: `${100 - this.state.codeEditorHeightInPercent}%`
          }
        : {
            width: `${100 - this.state.codeEditorWidthInPercent}%`,
            height: '100%'
          }
    )

    sliderStyle = Object.assign(
      sliderStyle,
      isStacking
        ? {
            left: 0,
            top: `${this.state.codeEditorHeightInPercent}%`
          }
        : {
            left: `${this.state.codeEditorWidthInPercent}%`,
            top: 0
          }
    )

    if (this.props.ignorePreviewPointerEvents || this.state.isSliderFocused)
      previewStyle.pointerEvents = 'none'

    return (
      <div
        styleName='root'
        ref='root'
        onMouseMove={e => this.handleMouseMove(e)}
        onMouseUp={e => this.handleMouseUp(e)}
      >
        <CodeEditor
          ref='code'
          width={editorStyle.width}
          height={editorStyle.height}
          mode='Boost Flavored Markdown'
          value={value}
          theme={config.editor.theme}
          keyMap={config.editor.keyMap}
          fontFamily={config.editor.fontFamily}
          fontSize={editorStyle.fontSize}
          displayLineNumbers={config.editor.displayLineNumbers}
          lineWrapping
          matchingPairs={config.editor.matchingPairs}
          matchingCloseBefore={config.editor.matchingCloseBefore}
          matchingTriples={config.editor.matchingTriples}
          explodingPairs={config.editor.explodingPairs}
          codeBlockMatchingPairs={config.editor.codeBlockMatchingPairs}
          codeBlockMatchingCloseBefore={
            config.editor.codeBlockMatchingCloseBefore
          }
          codeBlockMatchingTriples={config.editor.codeBlockMatchingTriples}
          codeBlockExplodingPairs={config.editor.codeBlockExplodingPairs}
          indentType={config.editor.indentType}
          indentSize={editorStyle.indentSize}
          enableRulers={config.editor.enableRulers}
          rulers={config.editor.rulers}
          scrollPastEnd={config.editor.scrollPastEnd}
          fetchUrlTitle={config.editor.fetchUrlTitle}
          enableTableEditor={config.editor.enableTableEditor}
          storageKey={storageKey}
          noteKey={noteKey}
          linesHighlighted={linesHighlighted}
          onChange={e => this.handleOnChange(e)}
          onScroll={e => this.handleEditorScroll(e)}
          onCursorActivity={e => this.handleCursorActivity(e)}
          spellCheck={config.editor.spellcheck}
          enableSmartPaste={config.editor.enableSmartPaste}
          hotkey={config.hotkey}
          switchPreview={config.editor.switchPreview}
          enableMarkdownLint={config.editor.enableMarkdownLint}
          customMarkdownLintConfig={config.editor.customMarkdownLintConfig}
          dateFormatISO8601={config.editor.dateFormatISO8601}
          deleteUnusedAttachments={config.editor.deleteUnusedAttachments}
          RTL={RTL}
        />
        <div
          styleName={isStacking ? 'slider-hoz' : 'slider'}
          style={{ left: sliderStyle.left, top: sliderStyle.top }}
          onMouseDown={e => this.handleMouseDown(e)}
        >
          <div styleName='slider-hitbox' />
        </div>
        <MarkdownPreview
          ref='preview'
          style={previewStyle}
          theme={config.ui.theme}
          keyMap={config.editor.keyMap}
          fontSize={config.preview.fontSize}
          fontFamily={config.preview.fontFamily}
          codeBlockTheme={config.preview.codeBlockTheme}
          codeBlockFontFamily={config.editor.fontFamily}
          lineNumber={config.preview.lineNumber}
          indentSize={editorIndentSize}
          scrollPastEnd={config.preview.scrollPastEnd}
          smartQuotes={config.preview.smartQuotes}
          smartArrows={config.preview.smartArrows}
          breaks={config.preview.breaks}
          sanitize={config.preview.sanitize}
          mermaidHTMLLabel={config.preview.mermaidHTMLLabel}
          tabInde='0'
          value={value}
          onCheckboxClick={e => this.handleCheckboxClick(e)}
          onScroll={e => this.handlePreviewScroll(e)}
          showCopyNotification={config.ui.showCopyNotification}
          storagePath={storage.path}
          noteKey={noteKey}
          customCSS={config.preview.customCSS}
          allowCustomCSS={config.preview.allowCustomCSS}
          lineThroughCheckbox={config.preview.lineThroughCheckbox}
          getNote={getNote}
          export={config.export}
          RTL={RTL}
        />
      </div>
    )
  }
}

export default CSSModules(MarkdownSplitEditor, styles)
