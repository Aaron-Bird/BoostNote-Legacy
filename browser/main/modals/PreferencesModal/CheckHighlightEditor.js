import React, { PropTypes } from 'react'
import CodeMirror from 'codemirror'
import _ from 'lodash'
const defaultEditorFontFamily = ['Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', 'monospace']

export default class CheckHighlightEditor extends React.Component {
    constructor (props) {
        super(props)
    }

    componentDidMount () {
        this.value = this.props.value
        this.editor = CodeMirror(this.refs.root, {
            value: this.props.value,
            lineNumbers: true,
            lineWrapping: true,
            theme: this.props.theme,
            indentUnit: 4,
            tabSize: 4,
            inputStyle: 'textarea'
        })

        this.setMode(this.props.mode)

        let editorTheme = document.getElementById('editorTheme')
    }

    setMode(mode) {
        let syntax = CodeMirror.findModeByName('ejs')
    }

    render() {
        let { className, fontFamily } = this.props
        fontFamily = _.isString(fontFamily) && fontFamily.length > 0
            ? [fontFamily].concat(defaultEditorFontFamily)
            : defaultEditorFontFamily
        return (
            <div className="CheckHilghtEditor"
                ref = 'root'
            />
        )
    }
}

CheckHighlightEditor.propTypes = {
    value: PropTypes.string.isRequired,
    mode: PropTypes.string,
    theme: PropTypes.string.isRequired,
    className: PropTypes.string,
}

CheckHighlightEditor.defaultProps = {
    readOnly: true,
    theme: 'base16-dark',
    fontSize: 14,
    fontFamily: 'Monaco, Consolas',
    indentSize: 4,
    indentType: 'space'
}
