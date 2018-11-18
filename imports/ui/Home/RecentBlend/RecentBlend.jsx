import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './RecentBlend.css';
import './RecentBlend.mobile.css';

class RecentBlend extends React.Component{

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
    return (
      <div 
        tabIndex='0'
        aria-label='go to blend'
        title='go to blend' 
        className='recent-blend-container' 
      >
        {(this.props.blend.images && this.props.blend.images.length > 0) ||
          (this.props.blend.tracks && this.props.blend.tracks.length > 0) ?
          <div 
            style={{ backgroundImage : `url(${this.getImageSrc(this.props.blend)})`}} 
            className='blend-cover-art' 
            alt="Playlist album covers" 
            onClick={() => FlowRouter.go(`/blend/${this.props.blend.code}`)}/> :
          <i 
            className='material-icons blend-cover-icon' 
            onClick={() => FlowRouter.go(`/blend/${this.props.blend.code}`)}> photo</i>
        }
        <a className='blend-name' href={`/blend/${this.props.blend.code}`}>{this.props.blend.name}</a>
        <p>Created by <a href={`/profile/${this.props.blend.owner.id}`}>{this.props.blend.owner.display_name}</a></p>
      </div>
    );
  }
}

RecentBlend.propTypes = {
  blend: PropTypes.object.isRequired
};

export default RecentBlend;
