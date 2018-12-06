import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './LastBlend.css';
import './LastBlend.mobile.css';

class LastBlend extends React.Component {

  getImageSrc(blend) {
    if (blend.images) {
      for (const image of blend.images) {
        return image.url;
      }
    }
    //If the playlist has not been assigned a list of images, get the album image of the first song
    return blend.tracks[0].track.album.images[1].url;
  }

  render() {
    return this.props.blend ? (
      <div className='last-blend-container'>
        <div className='last-top-container' 
          onClick={() => FlowRouter.go(`/blend/${this.props.blend.code}`)} 
          aria-label='go to blend'
          title='go to blend'>
          {(this.props.blend.images && this.props.blend.images.length > 0) ||
            (this.props.blend.tracks && this.props.blend.tracks.length > 0) ?
            <div 
              style={{ backgroundImage : `url(${this.getImageSrc(this.props.blend)})`}} 
              className='last-cover-art'
              alt="Playlist album covers"/> :
            <i 
              className='material-icons last-blend-cover-icon'> photo</i>
          }
        </div>
        <div className='last-content-container'>
          <h5 id='last-blend-title'>
            {this.props.blend.name}
          </h5>
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
