import React, { PropTypes } from 'react'

export default class ModeIcon extends React.Component {
  getClassName () {
    var mode = this.props.mode
    switch (mode) {
      // Script
      case 'javascript':
        return 'devicon-javascript-plain'
      case 'jsx':
        return 'devicon-react-original'
      case 'coffee':
        return 'devicon-coffeescript-original'
      case 'ruby':
        return 'devicon-ruby-plain'
      case 'erlang':
        return 'devicon-erlang-plain'
      case 'php':
        return 'devicon-php-plain'

      // HTML
      case 'html':
        return 'devicon-html5-plain'

      // Stylesheet
      case 'css':
        return 'devicon-css3-plain'
      case 'less':
        return 'devicon-less-plain-wordmark'
      case 'sass':
      case 'scss':
        return 'devicon-sass-original'

      // Compile
      case 'c_cpp':
        return 'devicon-c-plain'
      case 'csharp':
        return 'devicon-csharp-plain'
      case 'objc':
        return 'devicon-apple-original'
      case 'golang':
        return 'devicon-go-plain'
      case 'java':
        return 'devicon-java-plain'

      // Framework
      case 'django':
        return 'devicon-django-plain'

      // Config
      case 'dockerfile':
        return 'devicon-docker-plain'
      case 'gitignore':
        return 'devicon-git-plain'

      // Shell
      case 'sh':
      case 'batchfile':
      case 'powershell':
        return 'fa fa-fw fa-terminal'

      case 'text':
      case 'plain_text':
      case 'markdown':
        return 'fa fa-fw fa-file-text-o'
    }
    return 'fa fa-fw fa-code'
  }

  render () {
    var className = this.getClassName()
    return (
      <i className={this.props.className + ' ' + className}/>
    )
  }
}

ModeIcon.propTypes = {
  className: PropTypes.string,
  mode: PropTypes.string
}
