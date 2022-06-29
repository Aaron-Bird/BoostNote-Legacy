import PropTypes from 'prop-types'
import React from 'react'
import _ from 'lodash'
import CodeMirror from 'codemirror'
import hljs from 'highlight.js'
import 'codemirror-mode-elixir'
import attachmentManagement from 'browser/main/lib/dataApi/attachmentManagement'
import convertModeName from 'browser/lib/convertModeName'
import { options, TableEditor, Alignment } from '@susisu/mte-kernel'
import TextEditorInterface from 'browser/lib/TextEditorInterface'
import eventEmitter from 'browser/main/lib/eventEmitter'
import iconv from 'iconv-lite'

import { isMarkdownTitleURL } from 'browser/lib/utils'
import styles from '../components/CodeEditor.styl'
const { ipcRenderer, remote, clipboard } = require('electron')
import normalizeEditorFontFamily from 'browser/lib/normalizeEditorFontFamily'
const spellcheck = require('browser/lib/spellcheck')
const buildEditorContextMenu = require('browser/lib/contextMenuBuilder')
  .buildEditorContextMenu
import { createTurndownService } from '../lib/turndown'
import { languageMaps } from '../lib/CMLanguageList'
import snippetManager from '../lib/SnippetManager'
import { findStorage } from 'browser/lib/findStorage'
import { sendWakatimeHeartBeat } from 'browser/lib/wakatime-plugin'
import {
  generateInEditor,
  tocExistsInEditor
} from 'browser/lib/markdown-toc-generator'
import markdownlint from 'markdownlint'
import Jsonlint from 'jsonlint-mod'
import { DEFAULT_CONFIG } from '../main/lib/ConfigManager'
import prettier from 'prettier'

CodeMirror.modeURL = '../node_modules/codemirror/mode/%N/%N.js'

const buildCMRulers = (rulers, enableRulers) =>
  enableRulers
    ? rulers.map(ruler => ({
        column: ruler
      }))
    : []

function translateHotkey(hotkey) {
  return hotkey
    .replace(/\s*\+\s*/g, '-')
    .replace(/Command/g, 'Cmd')
    .replace(/Control/g, 'Ctrl')
}

export default class CodeEditor extends React.Component {
  constructor(props) {
    super(props)
    this.triggerScrollEvent = true
    this.scrollHandler = _.debounce(this.handleScroll.bind(this), 100, {
      leading: false,
      trailing: true
    })
    this.changeHandler = (editor, changeObject) =>
      this.handleChange(editor, changeObject)
    this.highlightHandler = (editor, changeObject) =>
      this.handleHighlight(editor, changeObject)
    this.focusHandler = () => {
      ipcRenderer.send('editor:focused', true)
    }
    this.debouncedDeletionOfAttachments = _.debounce(
      attachmentManagement.deleteAttachmentsNotPresentInNote,
      30000
    )
    this.blurHandler = (editor, e) => {
      ipcRenderer.send('editor:focused', false)
      if (e == null) return null
      let el = e.relatedTarget
      while (el != null) {
        if (el === this.refs.root) {
          return
        }
        el = el.parentNode
      }
      this.props.onBlur != null && this.props.onBlur(e)
      const { storageKey, noteKey } = this.props
      if (this.props.deleteUnusedAttachments === true) {
        this.debouncedDeletionOfAttachments(
          this.editor.getValue(),
          storageKey,
          noteKey
        )
      }
    }
    this.pasteHandler = (editor, e) => {
      e.preventDefault()

      this.handlePaste(editor, false)
    }
    this.loadStyleHandler = e => {
      this.editor.refresh()
    }
    this.searchHandler = (e, msg) => this.handleSearch(msg)
    this.searchState = null
    this.scrollToLineHandeler = this.scrollToLine.bind(this)
    this.getCodeEditorLintConfig = this.getCodeEditorLintConfig.bind(this)
    this.validatorOfMarkdown = this.validatorOfMarkdown.bind(this)

    this.formatTable = () => this.handleFormatTable()

    if (props.switchPreview !== 'RIGHTCLICK') {
      this.contextMenuHandler = function(editor, event) {
        const menu = buildEditorContextMenu(editor, event)
        if (menu != null) {
          setTimeout(() => menu.popup(remote.getCurrentWindow()), 30)
        }
      }
    }

    this.editorActivityHandler = () => this.handleEditorActivity()

    this.turndownService = createTurndownService()

    // wakatime
    const { storageKey, noteKey } = this.props
    const storage = findStorage(storageKey)
    if (storage)
      sendWakatimeHeartBeat(storage.path, noteKey, storage.name, {
        isWrite: false,
        hasFileChanges: false,
        isFileChange: true
      })
  }

  handleSearch(msg) {
    const cm = this.editor
    const component = this

    if (component.searchState) cm.removeOverlay(component.searchState)
    if (msg.length < 1) return

    cm.operation(function() {
      component.searchState = makeOverlay(msg, 'searching')
      cm.addOverlay(component.searchState)

      function makeOverlay(query, style) {
        query = new RegExp(
          query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'),
          'gi'
        )
        return {
          token: function(stream) {
            query.lastIndex = stream.pos
            var match = query.exec(stream.string)
            if (match && match.index === stream.pos) {
              stream.pos += match[0].length || 1
              return style
            } else if (match) {
              stream.pos = match.index
            } else {
              stream.skipToEnd()
            }
          }
        }
      }
    })
  }

  handleFormatTable() {
    this.tableEditor.formatAll(
      options({
        textWidthOptions: {}
      })
    )
  }

  handleEditorActivity() {
    if (this.props.onCursorActivity) {
      this.props.onCursorActivity(this.editor)
    }

    if (!this.textEditorInterface.transaction) {
      this.updateTableEditorState()
    }
  }

  updateDefaultKeyMap() {
    const { hotkey } = this.props
    const self = this
    const expandSnippet = snippetManager.expandSnippet

    this.defaultKeyMap = CodeMirror.normalizeKeyMap({
      Tab: function(cm) {
        const cursor = cm.getCursor()
        const line = cm.getLine(cursor.line)
        const cursorPosition = cursor.ch
        const charBeforeCursor = line.substr(cursorPosition - 1, 1)
        if (cm.somethingSelected()) cm.indentSelection('add')
        else {
          const tabs = cm.getOption('indentWithTabs')
          if (line.trimLeft().match(/^(-|\*|\+) (\[( |x)] )?$/)) {
            cm.execCommand('goLineStart')
            if (tabs) {
              cm.execCommand('insertTab')
            } else {
              cm.execCommand('insertSoftTab')
            }
            cm.execCommand('goLineEnd')
          } else if (
            !charBeforeCursor.match(/\t|\s|\r|\n|\$/) &&
            cursor.ch > 1
          ) {
            // text expansion on tab key if the char before is alphabet
            const wordBeforeCursor = self.getWordBeforeCursor(
              line,
              cursor.line,
              cursor.ch
            )
            if (expandSnippet(wordBeforeCursor, cursor, cm) === false) {
              if (tabs) {
                cm.execCommand('insertTab')
              } else {
                cm.execCommand('insertSoftTab')
              }
            }
          } else {
            if (tabs) {
              cm.execCommand('insertTab')
            } else {
              cm.execCommand('insertSoftTab')
            }
          }
        }
      },
      'Cmd-Left': function(cm) {
        cm.execCommand('goLineLeft')
      },
      'Cmd-T': function(cm) {
        // Do nothing
      },
      [translateHotkey(hotkey.insertDate)]: function(cm) {
        const dateNow = new Date()
        if (self.props.dateFormatISO8601) {
          cm.replaceSelection(dateNow.toISOString().split('T')[0])
        } else {
          cm.replaceSelection(dateNow.toLocaleDateString())
        }
      },
      [translateHotkey(hotkey.insertDateTime)]: function(cm) {
        const dateNow = new Date()
        if (self.props.dateFormatISO8601) {
          cm.replaceSelection(dateNow.toISOString())
        } else {
          cm.replaceSelection(dateNow.toLocaleString())
        }
      },
      Enter: 'boostNewLineAndIndentContinueMarkdownList',
      'Ctrl-C': cm => {
        if (cm.getOption('keyMap').substr(0, 3) === 'vim') {
          document.execCommand('copy')
        }
        return CodeMirror.Pass
      },
      [translateHotkey(hotkey.prettifyMarkdown)]: cm => {
        // Default / User configured prettier options
        const currentConfig = JSON.parse(self.props.prettierConfig)

        // Parser type will always need to be markdown so we override the option before use
        currentConfig.parser = 'markdown'

        // Get current cursor position
        const cursorPos = cm.getCursor()
        currentConfig.cursorOffset = cm.doc.indexFromPos(cursorPos)

        // Prettify contents of editor
        const formattedTextDetails = prettier.formatWithCursor(
          cm.doc.getValue(),
          currentConfig
        )

        const formattedText = formattedTextDetails.formatted
        const formattedCursorPos = formattedTextDetails.cursorOffset
        cm.doc.setValue(formattedText)

        // Reset Cursor position to be at the same markdown as was before prettifying
        const newCursorPos = cm.doc.posFromIndex(formattedCursorPos)
        cm.doc.setCursor(newCursorPos)
      },
      [translateHotkey(hotkey.sortLines)]: cm => {
        const selection = cm.doc.getSelection()
        const appendLineBreak = /\n$/.test(selection)

        const sorted = _.split(selection.trim(), '\n').sort()
        const sortedString =
          _.join(sorted, '\n') + (appendLineBreak ? '\n' : '')

        cm.doc.replaceSelection(sortedString)
      },
      [translateHotkey(hotkey.pasteSmartly)]: cm => {
        this.handlePaste(cm, true)
      }
    })
  }

  updateTableEditorState() {
    const active = this.tableEditor.cursorIsInTable(this.tableEditorOptions)
    if (active) {
      if (this.extraKeysMode !== 'editor') {
        this.extraKeysMode = 'editor'
        this.editor.setOption('extraKeys', this.editorKeyMap)
      }
    } else {
      if (this.extraKeysMode !== 'default') {
        this.extraKeysMode = 'default'
        this.editor.setOption('extraKeys', this.defaultKeyMap)
        this.tableEditor.resetSmartCursor()
      }
    }
  }

  componentDidMount() {
    const { rulers, enableRulers, enableMarkdownLint, RTL } = this.props
    eventEmitter.on('line:jump', this.scrollToLineHandeler)

    snippetManager.init()
    this.updateDefaultKeyMap()

    this.value = this.props.value
    this.editor = CodeMirror(this.refs.root, {
      rulers: buildCMRulers(rulers, enableRulers),
      value: this.props.value,
      linesHighlighted: this.props.linesHighlighted,
      lineNumbers: this.props.displayLineNumbers,
      lineWrapping: this.props.lineWrapping,
      theme: this.props.theme,
      indentUnit: this.props.indentSize,
      tabSize: this.props.indentSize,
      indentWithTabs: this.props.indentType !== 'space',
      keyMap: this.props.keyMap,
      scrollPastEnd: this.props.scrollPastEnd,
      inputStyle: 'textarea',
      dragDrop: false,
      direction: RTL ? 'rtl' : 'ltr',
      rtlMoveVisually: RTL,
      foldGutter: true,
      lint: enableMarkdownLint ? this.getCodeEditorLintConfig() : false,
      gutters: [
        'CodeMirror-linenumbers',
        'CodeMirror-foldgutter',
        'CodeMirror-lint-markers'
      ],
      autoCloseBrackets: {
        codeBlock: {
          pairs: this.props.codeBlockMatchingPairs,
          closeBefore: this.props.codeBlockMatchingCloseBefore,
          triples: this.props.codeBlockMatchingTriples,
          explode: this.props.codeBlockExplodingPairs
        },
        markdown: {
          pairs: this.props.matchingPairs,
          closeBefore: this.props.matchingCloseBefore,
          triples: this.props.matchingTriples,
          explode: this.props.explodingPairs
        }
      },
      extraKeys: this.defaultKeyMap,
      prettierConfig: this.props.prettierConfig
    })

    document.querySelector(
      '.CodeMirror-lint-markers'
    ).style.display = enableMarkdownLint ? 'inline-block' : 'none'

    if (!this.props.mode && this.props.value && this.props.autoDetect) {
      this.autoDetectLanguage(this.props.value)
    } else {
      this.setMode(this.props.mode)
    }

    this.editor.on('focus', this.focusHandler)
    this.editor.on('blur', this.blurHandler)
    this.editor.on('change', this.changeHandler)
    this.editor.on('gutterClick', this.highlightHandler)
    this.editor.on('paste', this.pasteHandler)
    if (this.props.switchPreview !== 'RIGHTCLICK') {
      this.editor.on('contextmenu', this.contextMenuHandler)
    }
    eventEmitter.on('top:search', this.searchHandler)

    eventEmitter.emit('code:init')
    this.editor.on('scroll', this.scrollHandler)
    this.editor.on('cursorActivity', this.editorActivityHandler)

    const editorTheme = document.getElementById('editorTheme')
    editorTheme.addEventListener('load', this.loadStyleHandler)

    CodeMirror.Vim.defineEx('quit', 'q', this.quitEditor)
    CodeMirror.Vim.defineEx('q!', 'q!', this.quitEditor)
    CodeMirror.Vim.defineEx('wq', 'wq', this.quitEditor)
    CodeMirror.Vim.defineEx('qw', 'qw', this.quitEditor)
    CodeMirror.Vim.map('ZZ', ':q', 'normal')

    this.textEditorInterface = new TextEditorInterface(this.editor)
    this.tableEditor = new TableEditor(this.textEditorInterface)
    if (this.props.spellCheck) {
      this.editor.addPanel(this.createSpellCheckPanel(), { position: 'bottom' })
    }

    eventEmitter.on('code:format-table', this.formatTable)

    this.tableEditorOptions = options({
      smartCursor: true
    })

    this.editorKeyMap = CodeMirror.normalizeKeyMap({
      Tab: () => {
        this.tableEditor.nextCell(this.tableEditorOptions)
      },
      'Shift-Tab': () => {
        this.tableEditor.previousCell(this.tableEditorOptions)
      },
      Enter: () => {
        this.tableEditor.nextRow(this.tableEditorOptions)
      },
      'Ctrl-Enter': () => {
        this.tableEditor.escape(this.tableEditorOptions)
      },
      'Cmd-Enter': () => {
        this.tableEditor.escape(this.tableEditorOptions)
      },
      'Shift-Ctrl-Left': () => {
        this.tableEditor.alignColumn(Alignment.LEFT, this.tableEditorOptions)
      },
      'Shift-Cmd-Left': () => {
        this.tableEditor.alignColumn(Alignment.LEFT, this.tableEditorOptions)
      },
      'Shift-Ctrl-Right': () => {
        this.tableEditor.alignColumn(Alignment.RIGHT, this.tableEditorOptions)
      },
      'Shift-Cmd-Right': () => {
        this.tableEditor.alignColumn(Alignment.RIGHT, this.tableEditorOptions)
      },
      'Shift-Ctrl-Up': () => {
        this.tableEditor.alignColumn(Alignment.CENTER, this.tableEditorOptions)
      },
      'Shift-Cmd-Up': () => {
        this.tableEditor.alignColumn(Alignment.CENTER, this.tableEditorOptions)
      },
      'Shift-Ctrl-Down': () => {
        this.tableEditor.alignColumn(Alignment.NONE, this.tableEditorOptions)
      },
      'Shift-Cmd-Down': () => {
        this.tableEditor.alignColumn(Alignment.NONE, this.tableEditorOptions)
      },
      'Ctrl-Left': () => {
        this.tableEditor.moveFocus(0, -1, this.tableEditorOptions)
      },
      'Cmd-Left': () => {
        this.tableEditor.moveFocus(0, -1, this.tableEditorOptions)
      },
      'Ctrl-Right': () => {
        this.tableEditor.moveFocus(0, 1, this.tableEditorOptions)
      },
      'Cmd-Right': () => {
        this.tableEditor.moveFocus(0, 1, this.tableEditorOptions)
      },
      'Ctrl-Up': () => {
        this.tableEditor.moveFocus(-1, 0, this.tableEditorOptions)
      },
      'Cmd-Up': () => {
        this.tableEditor.moveFocus(-1, 0, this.tableEditorOptions)
      },
      'Ctrl-Down': () => {
        this.tableEditor.moveFocus(1, 0, this.tableEditorOptions)
      },
      'Cmd-Down': () => {
        this.tableEditor.moveFocus(1, 0, this.tableEditorOptions)
      },
      'Ctrl-K Ctrl-I': () => {
        this.tableEditor.insertRow(this.tableEditorOptions)
      },
      'Cmd-K Cmd-I': () => {
        this.tableEditor.insertRow(this.tableEditorOptions)
      },
      'Ctrl-L Ctrl-I': () => {
        this.tableEditor.deleteRow(this.tableEditorOptions)
      },
      'Cmd-L Cmd-I': () => {
        this.tableEditor.deleteRow(this.tableEditorOptions)
      },
      'Ctrl-K Ctrl-J': () => {
        this.tableEditor.insertColumn(this.tableEditorOptions)
      },
      'Cmd-K Cmd-J': () => {
        this.tableEditor.insertColumn(this.tableEditorOptions)
      },
      'Ctrl-L Ctrl-J': () => {
        this.tableEditor.deleteColumn(this.tableEditorOptions)
      },
      'Cmd-L Cmd-J': () => {
        this.tableEditor.deleteColumn(this.tableEditorOptions)
      },
      'Alt-Shift-Ctrl-Left': () => {
        this.tableEditor.moveColumn(-1, this.tableEditorOptions)
      },
      'Alt-Shift-Cmd-Left': () => {
        this.tableEditor.moveColumn(-1, this.tableEditorOptions)
      },
      'Alt-Shift-Ctrl-Right': () => {
        this.tableEditor.moveColumn(1, this.tableEditorOptions)
      },
      'Alt-Shift-Cmd-Right': () => {
        this.tableEditor.moveColumn(1, this.tableEditorOptions)
      },
      'Alt-Shift-Ctrl-Up': () => {
        this.tableEditor.moveRow(-1, this.tableEditorOptions)
      },
      'Alt-Shift-Cmd-Up': () => {
        this.tableEditor.moveRow(-1, this.tableEditorOptions)
      },
      'Alt-Shift-Ctrl-Down': () => {
        this.tableEditor.moveRow(1, this.tableEditorOptions)
      },
      'Alt-Shift-Cmd-Down': () => {
        this.tableEditor.moveRow(1, this.tableEditorOptions)
      }
    })

    if (this.props.enableTableEditor) {
      this.editor.on('changes', this.editorActivityHandler)
    }

    this.setState({
      clientWidth: this.refs.root.clientWidth
    })

    this.initialHighlighting()
  }

  getWordBeforeCursor(line, lineNumber, cursorPosition) {
    let wordBeforeCursor = ''
    const originCursorPosition = cursorPosition
    const emptyChars = /\t|\s|\r|\n|\$/

    // to prevent the word is long that will crash the whole app
    // the safeStop is there to stop user to expand words that longer than 20 chars
    const safeStop = 20

    while (cursorPosition > 0) {
      const currentChar = line.substr(cursorPosition - 1, 1)
      // if char is not an empty char
      if (!emptyChars.test(currentChar)) {
        wordBeforeCursor = currentChar + wordBeforeCursor
      } else if (wordBeforeCursor.length >= safeStop) {
        throw new Error('Stopped after 20 loops for safety reason !')
      } else {
        break
      }
      cursorPosition--
    }

    return {
      text: wordBeforeCursor,
      range: {
        from: {
          line: lineNumber,
          ch: originCursorPosition
        },
        to: {
          line: lineNumber,
          ch: cursorPosition
        }
      }
    }
  }

  quitEditor() {
    document.querySelector('textarea').blur()
  }

  componentWillUnmount() {
    this.editor.off('focus', this.focusHandler)
    this.editor.off('blur', this.blurHandler)
    this.editor.off('change', this.changeHandler)
    this.editor.off('paste', this.pasteHandler)
    eventEmitter.off('top:search', this.searchHandler)
    this.editor.off('scroll', this.scrollHandler)
    this.editor.off('cursorActivity', this.editorActivityHandler)
    this.editor.off('contextmenu', this.contextMenuHandler)
    eventEmitter.off('line:jump', this.scrollToLineHandeler)

    const editorTheme = document.getElementById('editorTheme')
    editorTheme.removeEventListener('load', this.loadStyleHandler)

    spellcheck.setLanguage(null, spellcheck.SPELLCHECK_DISABLED)
    eventEmitter.off('code:format-table', this.formatTable)

    if (this.props.enableTableEditor) {
      this.editor.off('changes', this.editorActivityHandler)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let needRefresh = false
    const {
      rulers,
      enableRulers,
      enableMarkdownLint,
      customMarkdownLintConfig
    } = this.props
    if (prevProps.mode !== this.props.mode) {
      this.setMode(this.props.mode)
    }
    if (prevProps.theme !== this.props.theme) {
      this.editor.setOption('theme', this.props.theme)
      // editor should be refreshed after css loaded
    }
    if (prevProps.fontSize !== this.props.fontSize) {
      needRefresh = true
    }
    if (prevProps.fontFamily !== this.props.fontFamily) {
      needRefresh = true
    }
    if (prevProps.keyMap !== this.props.keyMap) {
      needRefresh = true
    }
    if (prevProps.RTL !== this.props.RTL) {
      this.editor.setOption('direction', this.props.RTL ? 'rtl' : 'ltr')
      this.editor.setOption('rtlMoveVisually', this.props.RTL)
    }
    if (
      prevProps.enableMarkdownLint !== enableMarkdownLint ||
      prevProps.customMarkdownLintConfig !== customMarkdownLintConfig
    ) {
      if (!enableMarkdownLint) {
        this.editor.setOption('lint', { default: false })
        document.querySelector('.CodeMirror-lint-markers').style.display =
          'none'
      } else {
        this.editor.setOption('lint', this.getCodeEditorLintConfig())
        document.querySelector('.CodeMirror-lint-markers').style.display =
          'inline-block'
      }
      needRefresh = true
    }

    if (
      prevProps.enableRulers !== enableRulers ||
      prevProps.rulers !== rulers
    ) {
      this.editor.setOption('rulers', buildCMRulers(rulers, enableRulers))
    }

    if (prevProps.indentSize !== this.props.indentSize) {
      this.editor.setOption('indentUnit', this.props.indentSize)
      this.editor.setOption('tabSize', this.props.indentSize)
    }
    if (prevProps.indentType !== this.props.indentType) {
      this.editor.setOption('indentWithTabs', this.props.indentType !== 'space')
    }

    if (prevProps.displayLineNumbers !== this.props.displayLineNumbers) {
      this.editor.setOption('lineNumbers', this.props.displayLineNumbers)
    }

    if (prevProps.lineWrapping !== this.props.lineWrapping) {
      this.editor.setOption('lineWrapping', this.props.lineWrapping)
    }

    if (prevProps.scrollPastEnd !== this.props.scrollPastEnd) {
      this.editor.setOption('scrollPastEnd', this.props.scrollPastEnd)
    }

    if (
      prevProps.matchingPairs !== this.props.matchingPairs ||
      prevProps.matchingCloseBefore !== this.props.matchingCloseBefore ||
      prevProps.matchingTriples !== this.props.matchingTriples ||
      prevProps.explodingPairs !== this.props.explodingPairs ||
      prevProps.codeBlockMatchingPairs !== this.props.codeBlockMatchingPairs ||
      prevProps.codeBlockMatchingCloseBefore !==
        this.props.codeBlockMatchingCloseBefore ||
      prevProps.codeBlockMatchingTriples !==
        this.props.codeBlockMatchingTriples ||
      prevProps.codeBlockExplodingPairs !== this.props.codeBlockExplodingPairs
    ) {
      const autoCloseBrackets = {
        codeBlock: {
          pairs: this.props.codeBlockMatchingPairs,
          closeBefore: this.props.codeBlockMatchingCloseBefore,
          triples: this.props.codeBlockMatchingTriples,
          explode: this.props.codeBlockExplodingPairs
        },
        markdown: {
          pairs: this.props.matchingPairs,
          closeBefore: this.props.matchingCloseBefore,
          triples: this.props.matchingTriples,
          explode: this.props.explodingPairs
        }
      }

      this.editor.setOption('autoCloseBrackets', autoCloseBrackets)
    }

    if (prevProps.enableTableEditor !== this.props.enableTableEditor) {
      if (this.props.enableTableEditor) {
        this.editor.on('cursorActivity', this.editorActivityHandler)
        this.editor.on('changes', this.editorActivityHandler)
      } else {
        this.editor.off('cursorActivity', this.editorActivityHandler)
        this.editor.off('changes', this.editorActivityHandler)
      }

      this.extraKeysMode = 'default'
      this.editor.setOption('extraKeys', this.defaultKeyMap)
    }

    if (prevProps.hotkey !== this.props.hotkey) {
      this.updateDefaultKeyMap()

      if (this.extraKeysMode === 'default') {
        this.editor.setOption('extraKeys', this.defaultKeyMap)
      }
    }

    if (this.state.clientWidth !== this.refs.root.clientWidth) {
      this.setState({
        clientWidth: this.refs.root.clientWidth
      })

      needRefresh = true
    }

    if (prevProps.spellCheck !== this.props.spellCheck) {
      if (this.props.spellCheck === false) {
        spellcheck.setLanguage(this.editor, spellcheck.SPELLCHECK_DISABLED)
        const elem = document.getElementById('editor-bottom-panel')
        elem.parentNode.removeChild(elem)
      } else {
        this.editor.addPanel(this.createSpellCheckPanel(), {
          position: 'bottom'
        })
      }
    }
    if (
      prevProps.deleteUnusedAttachments !== this.props.deleteUnusedAttachments
    ) {
      this.editor.setOption(
        'deleteUnusedAttachments',
        this.props.deleteUnusedAttachments
      )
    }

    if (needRefresh) {
      this.editor.refresh()
    }
  }

  getCodeEditorLintConfig() {
    const { mode } = this.props
    const checkMarkdownNoteIsOpen = mode === 'Boost Flavored Markdown'

    return checkMarkdownNoteIsOpen
      ? {
          getAnnotations: this.validatorOfMarkdown,
          async: true
        }
      : false
  }

  validatorOfMarkdown(text, updateLinting) {
    const { customMarkdownLintConfig } = this.props
    let lintConfigJson
    try {
      Jsonlint.parse(customMarkdownLintConfig)
      lintConfigJson = JSON.parse(customMarkdownLintConfig)
    } catch (err) {
      eventEmitter.emit('APP_SETTING_ERROR')
      return
    }
    const lintOptions = {
      strings: {
        content: text
      },
      config: lintConfigJson
    }

    return markdownlint(lintOptions, (err, result) => {
      if (!err) {
        const foundIssues = []
        const splitText = text.split('\n')
        result.content.map(item => {
          let ruleNames = ''
          item.ruleNames.map((ruleName, index) => {
            ruleNames += ruleName
            ruleNames += index === item.ruleNames.length - 1 ? ': ' : '/'
          })
          const lineNumber = item.lineNumber - 1
          foundIssues.push({
            from: CodeMirror.Pos(lineNumber, 0),
            to: CodeMirror.Pos(lineNumber, splitText[lineNumber].length),
            message: ruleNames + item.ruleDescription,
            severity: 'warning'
          })
        })
        updateLinting(foundIssues)
      }
    })
  }

  setMode(mode) {
    let syntax = CodeMirror.findModeByName(convertModeName(mode || 'text'))
    if (syntax == null) syntax = CodeMirror.findModeByName('Plain Text')

    this.editor.setOption('mode', syntax.mime)
    CodeMirror.autoLoadMode(this.editor, syntax.mode)
  }

  handleChange(editor, changeObject) {
    this.debouncedDeletionOfAttachments.cancel()

    spellcheck.handleChange(editor, changeObject)

    // The current note contains an toc. We'll check for changes on headlines.
    // origin is undefined when markdownTocGenerator replace the old tod
    if (tocExistsInEditor(editor) && changeObject.origin !== undefined) {
      let requireTocUpdate

      // Check if one of the changed lines contains a headline
      for (let line = 0; line < changeObject.text.length; line++) {
        if (
          this.linePossibleContainsHeadline(
            editor.getLine(changeObject.from.line + line)
          )
        ) {
          requireTocUpdate = true
          break
        }
      }

      if (!requireTocUpdate) {
        // Check if one of the removed lines contains a headline
        for (let line = 0; line < changeObject.removed.length; line++) {
          if (this.linePossibleContainsHeadline(changeObject.removed[line])) {
            requireTocUpdate = true
            break
          }
        }
      }

      if (requireTocUpdate) {
        generateInEditor(editor)
      }
    }

    this.updateHighlight(editor, changeObject)

    this.value = editor.getValue()

    const { storageKey, noteKey } = this.props
    const storage = findStorage(storageKey)
    if (this.props.onChange) {
      this.props.onChange(editor)
    }

    const isWrite = !!this.props.onChange
    const hasFileChanges = isWrite

    if (storage) {
      sendWakatimeHeartBeat(storage.path, noteKey, storage.name, {
        isWrite,
        hasFileChanges,
        isFileChange: false
      })
    }
  }

  linePossibleContainsHeadline(currentLine) {
    // We can't check if the line start with # because when some write text before
    // the # we also need to update the toc
    return currentLine.includes('# ')
  }

  incrementLines(start, linesAdded, linesRemoved, editor) {
    const highlightedLines = editor.options.linesHighlighted

    const totalHighlightedLines = highlightedLines.length

    const offset = linesAdded - linesRemoved

    // Store new items to be added as we're changing the lines
    const newLines = []

    let i = totalHighlightedLines

    while (i--) {
      const lineNumber = highlightedLines[i]

      // Interval that will need to be updated
      // Between start and (start + offset) remove highlight
      if (lineNumber >= start) {
        highlightedLines.splice(highlightedLines.indexOf(lineNumber), 1)

        // Lines that need to be relocated
        if (lineNumber >= start + linesRemoved) {
          newLines.push(lineNumber + offset)
        }
      }
    }

    // Adding relocated lines
    highlightedLines.push(...newLines)

    if (this.props.onChange) {
      this.props.onChange(editor)
    }
  }

  handleHighlight(editor, changeObject) {
    const lines = editor.options.linesHighlighted

    if (!lines.includes(changeObject)) {
      lines.push(changeObject)
      editor.addLineClass(
        changeObject,
        'text',
        'CodeMirror-activeline-background'
      )
    } else {
      lines.splice(lines.indexOf(changeObject), 1)
      editor.removeLineClass(
        changeObject,
        'text',
        'CodeMirror-activeline-background'
      )
    }
    if (this.props.onChange) {
      this.props.onChange(editor)
    }
  }

  updateHighlight(editor, changeObject) {
    const linesAdded = changeObject.text.length - 1
    const linesRemoved = changeObject.removed.length - 1

    // If no lines added or removed return
    if (linesAdded === 0 && linesRemoved === 0) {
      return
    }

    let start = changeObject.from.line

    switch (changeObject.origin) {
      case '+insert", "undo':
        start += 1
        break

      case 'paste':
      case '+delete':
      case '+input':
        if (changeObject.to.ch !== 0 || changeObject.from.ch !== 0) {
          start += 1
        }
        break

      default:
        return
    }

    this.incrementLines(start, linesAdded, linesRemoved, editor)
  }

  moveCursorTo(row, col) {}

  scrollToLine(event, num, triggerScrollEvent = false) {
    const top = this.editor.charCoords({ line: num, ch: 0 }, 'local').top
    this.triggerScrollEvent = triggerScrollEvent
    try {
      this.editor.scrollTo(null, top)
    } catch (err) {
      console.log(err)
    } finally {
      // TODO: Use callback instend of timer
      setTimeout(() => {
        this.triggerScrollEvent = true
      }, 300)
    }
  }

  focus() {
    this.editor.focus()
  }

  blur() {
    this.editor.blur()
  }

  reload() {
    // Change event shouldn't be fired when switch note
    this.editor.off('change', this.changeHandler)
    this.value = this.props.value
    this.editor.setValue(this.props.value)
    this.editor.clearHistory()
    this.restartHighlighting()
    this.editor.on('change', this.changeHandler)
    this.editor.refresh()

    // wakatime
    const { storageKey, noteKey } = this.props
    const storage = findStorage(storageKey)
    if (storage)
      sendWakatimeHeartBeat(storage.path, noteKey, storage.name, {
        isWrite: false,
        hasFileChanges: false,
        isFileChange: true
      })
  }

  setValue(value) {
    const cursor = this.editor.getCursor()
    this.editor.setValue(value)
    this.editor.setCursor(cursor)
  }

  /**
   * Update content of one line
   * @param {Number} lineNumber
   * @param {String} content
   */
  setLineContent(lineNumber, content) {
    const prevContent = this.editor.getLine(lineNumber)
    const prevContentLength = prevContent ? prevContent.length : 0
    this.editor.replaceRange(
      content,
      { line: lineNumber, ch: 0 },
      { line: lineNumber, ch: prevContentLength }
    )
  }

  handleDropImage(dropEvent) {
    dropEvent.preventDefault()
    const { storageKey, noteKey } = this.props
    attachmentManagement.handleAttachmentDrop(
      this,
      storageKey,
      noteKey,
      dropEvent
    )
  }

  insertAttachmentMd(imageMd) {
    this.editor.replaceSelection(imageMd)
  }

  autoDetectLanguage(content) {
    const res = hljs.highlightAuto(content, Object.keys(languageMaps))
    this.setMode(languageMaps[res.language])
  }

  handlePaste(editor, forceSmartPaste) {
    const { storageKey, noteKey, fetchUrlTitle, enableSmartPaste } = this.props

    const isURL = str =>
      /(?:^\w+:|^)\/\/(?:[^\s\.]+\.\S{2}|localhost[\:?\d]*)/.test(str)

    const isInLinkTag = editor => {
      const startCursor = editor.getCursor('start')
      const prevChar = editor.getRange(
        {
          line: startCursor.line,
          ch: startCursor.ch - 2
        },
        {
          line: startCursor.line,
          ch: startCursor.ch
        }
      )
      const endCursor = editor.getCursor('end')
      const nextChar = editor.getRange(
        {
          line: endCursor.line,
          ch: endCursor.ch
        },
        {
          line: endCursor.line,
          ch: endCursor.ch + 1
        }
      )
      return prevChar === '](' && nextChar === ')'
    }

    const isInFencedCodeBlock = editor => {
      const cursor = editor.getCursor()

      let token = editor.getTokenAt(cursor)
      if (token.state.fencedState) {
        return true
      }

      let line = (line = cursor.line - 1)
      let num = 0
      while (line >= 0) {
        token = editor.getTokenAt({
          ch: 3,
          line
        })
        if (token.type === 'comment') {
          num++
        }
        line--
      }

      return num % 2 > 0
    }

    const pastedTxt = clipboard.readText()

    if (isInFencedCodeBlock(editor)) {
      this.handlePasteText(editor, pastedTxt)
    } else if (
      fetchUrlTitle &&
      isMarkdownTitleURL(pastedTxt) &&
      !isInLinkTag(editor)
    ) {
      this.handlePasteUrl(editor, pastedTxt)
    } else if (fetchUrlTitle && isURL(pastedTxt) && !isInLinkTag(editor)) {
      this.handlePasteUrl(editor, pastedTxt)
    } else if (attachmentManagement.isAttachmentLink(pastedTxt)) {
      attachmentManagement
        .handleAttachmentLinkPaste(storageKey, noteKey, pastedTxt)
        .then(modifiedText => {
          this.editor.replaceSelection(modifiedText)
        })
    } else {
      const image = clipboard.readImage()
      if (!image.isEmpty()) {
        attachmentManagement.handlePasteNativeImage(
          this,
          storageKey,
          noteKey,
          image
        )
      } else if (enableSmartPaste || forceSmartPaste) {
        const pastedHtml = clipboard.readHTML()
        if (pastedHtml.length > 0) {
          this.handlePasteHtml(editor, pastedHtml)
        } else {
          this.handlePasteText(editor, pastedTxt)
        }
      } else {
        this.handlePasteText(editor, pastedTxt)
      }
    }

    if (!this.props.mode && this.props.autoDetect) {
      this.autoDetectLanguage(editor.doc.getValue())
    }
  }

  handleScroll(e) {
    if (this.props.onScroll && this.triggerScrollEvent) {
      this.props.onScroll(e)
    }
  }

  handlePasteUrl(editor, pastedTxt) {
    let taggedUrl = `<${pastedTxt}>`
    let urlToFetch = pastedTxt
    let titleMark = ''

    if (isMarkdownTitleURL(pastedTxt)) {
      const pastedTxtSplitted = pastedTxt.split(' ')
      titleMark = `${pastedTxtSplitted[0]} `
      urlToFetch = pastedTxtSplitted[1]
      taggedUrl = `<${urlToFetch}>`
    }

    editor.replaceSelection(taggedUrl)

    const isImageReponse = response => {
      return (
        response.headers.has('content-type') &&
        response.headers.get('content-type').match(/^image\/.+$/)
      )
    }
    const replaceTaggedUrl = replacement => {
      const scrollEl = editor.getScrollerElement()
      const scrollTop = scrollEl.scrollTop

      const value = editor.getValue()
      const cursor = editor.getCursor()
      const newValue = value.replace(taggedUrl, titleMark + replacement)
      const newCursor = Object.assign({}, cursor, {
        ch: cursor.ch + newValue.length - (value.length - titleMark.length)
      })

      editor.setValue(newValue)
      editor.setCursor(newCursor)
      Promise.resolve().then(() => {
        scrollEl.scrollTo({
          top: scrollTop
        })
      })
    }

    fetch(urlToFetch, {
      method: 'get'
    })
      .then(response => {
        if (isImageReponse(response)) {
          return this.mapImageResponse(response, urlToFetch)
        } else {
          return this.mapNormalResponse(response, urlToFetch)
        }
      })
      .then(replacement => {
        replaceTaggedUrl(replacement)
      })
      .catch(e => {
        replaceTaggedUrl(pastedTxt)
      })
  }

  handlePasteHtml(editor, pastedHtml) {
    const markdown = this.turndownService.turndown(pastedHtml)
    editor.replaceSelection(markdown)
  }

  handlePasteText(editor, pastedTxt) {
    editor.replaceSelection(pastedTxt)
  }

  mapNormalResponse(response, pastedTxt) {
    return this.decodeResponse(response).then(body => {
      return new Promise((resolve, reject) => {
        try {
          const parsedBody = new window.DOMParser().parseFromString(
            body,
            'text/html'
          )
          const escapePipe = str => {
            return str.replace('|', '\\|')
          }
          const linkWithTitle = `[${escapePipe(
            parsedBody.title
          )}](${pastedTxt})`
          resolve(linkWithTitle)
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  initialHighlighting() {
    if (this.editor.options.linesHighlighted == null) {
      return
    }

    const totalHighlightedLines = this.editor.options.linesHighlighted.length
    const totalAvailableLines = this.editor.lineCount()

    for (let i = 0; i < totalHighlightedLines; i++) {
      const lineNumber = this.editor.options.linesHighlighted[i]
      if (lineNumber > totalAvailableLines) {
        // make sure that we skip the invalid lines althrough this case should not be happened.
        continue
      }
      this.editor.addLineClass(
        lineNumber,
        'text',
        'CodeMirror-activeline-background'
      )
    }
  }

  restartHighlighting() {
    this.editor.options.linesHighlighted = this.props.linesHighlighted
    this.initialHighlighting()
  }

  mapImageResponse(response, pastedTxt) {
    return new Promise((resolve, reject) => {
      try {
        const url = response.url
        const name = url.substring(url.lastIndexOf('/') + 1)
        const imageLinkWithName = `![${name}](${pastedTxt})`
        resolve(imageLinkWithName)
      } catch (e) {
        reject(e)
      }
    })
  }

  decodeResponse(response) {
    const headers = response.headers
    const _charset = headers.has('content-type')
      ? this.extractContentTypeCharset(headers.get('content-type'))
      : undefined
    return response.arrayBuffer().then(buff => {
      return new Promise((resolve, reject) => {
        try {
          const charset =
            _charset !== undefined && iconv.encodingExists(_charset)
              ? _charset
              : 'utf-8'
          resolve(iconv.decode(Buffer.from(buff), charset).toString())
        } catch (e) {
          reject(e)
        }
      })
    })
  }

  extractContentTypeCharset(contentType) {
    return contentType
      .split(';')
      .filter(str => {
        return str
          .trim()
          .toLowerCase()
          .startsWith('charset')
      })
      .map(str => {
        return str.replace(/['"]/g, '').split('=')[1]
      })[0]
  }

  render() {
    const { className, fontSize, fontFamily, width, height } = this.props
    const normalisedFontFamily = normalizeEditorFontFamily(fontFamily)

    return (
      <div
        className={className == null ? 'CodeEditor' : `CodeEditor ${className}`}
        ref='root'
        tabIndex='-1'
        style={{
          fontFamily: normalisedFontFamily,
          fontSize,
          width,
          height
        }}
        onDrop={e => this.handleDropImage(e)}
      />
    )
  }

  createSpellCheckPanel() {
    const panel = document.createElement('div')
    panel.className = 'panel bottom'
    panel.id = 'editor-bottom-panel'
    const dropdown = document.createElement('select')
    dropdown.title = 'Spellcheck'
    dropdown.className = styles['spellcheck-select']
    dropdown.addEventListener('change', e =>
      spellcheck.setLanguage(this.editor, dropdown.value)
    )
    const options = spellcheck.getAvailableDictionaries()
    for (const op of options) {
      const option = document.createElement('option')
      option.value = op.value
      option.innerHTML = op.label
      dropdown.appendChild(option)
    }
    panel.appendChild(dropdown)
    return panel
  }
}

CodeEditor.propTypes = {
  value: PropTypes.string,
  enableRulers: PropTypes.bool,
  rulers: PropTypes.arrayOf(Number),
  mode: PropTypes.string,
  className: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  autoDetect: PropTypes.bool,
  spellCheck: PropTypes.bool,
  enableMarkdownLint: PropTypes.bool,
  customMarkdownLintConfig: PropTypes.string,
  deleteUnusedAttachments: PropTypes.bool,
  RTL: PropTypes.bool
}

CodeEditor.defaultProps = {
  readOnly: false,
  theme: 'xcode',
  keyMap: 'sublime',
  fontSize: 14,
  fontFamily: 'Monaco, Consolas',
  indentSize: 4,
  indentType: 'space',
  autoDetect: false,
  spellCheck: false,
  enableMarkdownLint: DEFAULT_CONFIG.editor.enableMarkdownLint,
  customMarkdownLintConfig: DEFAULT_CONFIG.editor.customMarkdownLintConfig,
  prettierConfig: DEFAULT_CONFIG.editor.prettierConfig,
  deleteUnusedAttachments: DEFAULT_CONFIG.editor.deleteUnusedAttachments,
  RTL: false
}
