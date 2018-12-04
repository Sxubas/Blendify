import React from 'react';
import PropTypes from 'prop-types';

import './LastBlend.css';
import './LastBlend.mobile.css';

class LastBlend extends React.Component {

  render() {
    return this.props.blend ? (
      <div className='last-blend-container'>
        <div className='last-top-container'>
          <div
            style={{ backgroundImage: this.props.blend.images[0] ? `url(${this.props.blend.images[0].url})` : undefined}}
            className='last-cover-art'>
          </div>
          <h5 id='last-blend-title'>
            {this.props.blend.name}
          </h5>
        </div>
        <div className='last-bottom-container'>
          <p>Code: {this.props.blend.code}</p>
          <p>{this.props.blend.tracks.length} Track{this.props.blend.tracks.length!==1 && 's'}</p>
          <p>{this.props.blend.contributors.length} Contributor{this.props.blend.contributors.length!==1 && 's'}</p>
        </div>
      </div>
    ) : null;
  }

}

LastBlend.propTypes = {
  blend: PropTypes.object
};

export default LastBlend;
