import React, { PropTypes} from 'react'
import md5 from 'md5'

export default class ProfileImage extends React.Component {
  render () {
    let className = this.props.className == null ? 'ProfileImage' : 'ProfileImage ' + this.props.className
    let email = this.props.email != null ? this.props.email : ''
    let src = 'http://www.gravatar.com/avatar/' + md5(email.trim().toLowerCase()) + '?s=' + this.props.size

    return (
      <img
        className={className}
        width={this.props.size}
        height={this.props.size}
        src={src}/>
    )
  }
}

ProfileImage.propTypes = {
  email: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string
}
