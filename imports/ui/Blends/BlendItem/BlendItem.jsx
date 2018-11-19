import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './BlendItem.css';

class BlendItem extends Component {

  getImageSrc(blend) {
    if (blend.images) {
      //Inverse loop to pick smallest image 
      for (let i = blend.images.length - 1; i >= 0; i--) {
        return blend.images[i].url;
      }
    }
    //If the playlist has not been assigned a list of images, get the album image of the first song
    return blend.tracks[0].track.album.images[1].url;
  }

  render() {
    return (
      <div className='blend-item-container'>
        <div className='blend-item-content'>
          {(this.props.blend.images && this.props.blend.images.length > 0) ||
            (this.props.blend.tracks && this.props.blend.tracks.length > 0) ?
            <div
              style={{ backgroundImage: `url(${this.getImageSrc(this.props.blend)})` }}
              className='blend-item-cover-art' /> :
            <i className='material-icons blend-cover-icon'>photo</i>}
          <div className="blend-item-text">
            <a href={`/blend/${this.props.blend.code}`} className='blend-item-title title'>{this.props.blend.name}</a >
            <span>Owner: <a href={`/profile/${this.props.blend.owner.id}`}>{this.props.blend.owner.display_name}</a> </span>
          </div>
        </div>

        <div>
          <i className='material-icons'>more_horiz</i>
        </div>

      </div>
    );
  }
}

BlendItem.propTypes = {
  blend: PropTypes.object.isRequired
};

export default BlendItem;
