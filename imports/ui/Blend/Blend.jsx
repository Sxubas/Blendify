import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Rooms } from '../../api/rooms.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Track from './Track/Track.jsx';

import './Blend.css';
import './Blend.mobile.css';

class Blend extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showingContributors: false,
      showTracksToAdd: false,
      edit: false,
      tracksToAdd: [],
      tracksRetrieved: [],
      tracksToRemove: [],
    };
  }

  edit() {
    this.setState({ showTracksToAdd: false, edit: true, tracksToRemove: [] });
  }

  deleteTrackToAdd(i) {
    this.setState({
      tracksToAdd: this.state.tracksToAdd.filter((_, i2) => {
        return i !== i2;
      })
    });
  }

  deleteTrack(uri, i) {
    this.setState({
      tracksToRemove: this.state.tracksToRemove.concat([{ uri, positions: [i] }])
    });
  }

  submitTracksToRemove() {
    Meteor.call('rooms.removeTracks', this.props.room.code, this.state.tracksToRemove, (err) => {
      if (err) {
        console.log(err);
        alert(err);
      }
      Meteor.call('rooms.updateRoom', this.props.room.code, (err) => {
        if (err) {
          console.log(err);
          alert(err);
          if (err.error === 'The playlist has been deleted') FlowRouter.go('home');
        }
        this.setState({ edit: false, tracksToRemove: [] });
      });
    });
  }

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
    return (this.props.room ?
      <div className="blend-container">
        <div className='blend-title-container'>
          {/* Blend image rendering */}
          {(this.props.room.images && this.props.room.images.length > 0) ||
            (this.props.room.tracks && this.props.room.tracks.length > 0) ?
            <img src={this.getImageSrc(this.props.room)} className='blend-title-image' alt="Playlist image" /> :
            <i className='material-icons blend-title-image'>photo</i>}

          <div className='blend-title-text'>
            <h3 className="blend-name">{this.props.room.name}</h3>
            <span>
              Created by 
              <a href={`/profile/${this.props.room.owner.id}`}>{this.props.room.owner.display_name}</a>
            </span>

            {/* Contributors rendering */}
            {this.props.room.contributors.length > 1 ?
              <span
                className='blend-title-contributors'
                onClick={() => this.setState({ showingContributors: !this.state.showingContributors })}>
                {this.state.showingContributors ? 'Hide contributors' : `${this.props.room.contributors.length - 1} Contributors`}
              </span> :
              <span>No contributors yet</span>}

            {this.state.showingContributors && this.renderContributors()}

            <button onClick={() => FlowRouter.go(`/blend/${this.props.code}/add_tracks`)} className='btn white'>Add tracks</button>
            <button onClick={() => FlowRouter.go(`/blend/${this.props.code}/remove_tracks`)} className='btn white'>Remove tracks</button>
          </div>
        </div>

        <div className='track-list-container'>
          {this.props.room.tracks.map((track, i) =>
            <Track track={track.track} key={i} />)}
        </div>
      </div> : null /* Necessary due to withTracker */
    );
  }


  renderContributors() {
    return (
      <div className='blend-contributors-container'>
        {this.props.room.contributors.map((contr, i) => {
          if (i === this.props.room.contributors.length - 1) { /*Render the last one without ','*/
            return (
              <div key={contr.display_name}><a href={`profile/${contr.display_name}`}>{contr.display_name}</a></div>
            );
          }
          if (i !== 0) { /*Do not render first contributor (owner)*/
            return (
              <div key={contr.display_name}><a href={`profile/${contr.display_name}`}>{contr.display_name}</a>, </div>
            );
          }
        })}
      </div>
    );
  }

}

Blend.propTypes = {
  user: PropTypes.object,
  code: PropTypes.string.isRequired,
  room: PropTypes.object,
};

export default withTracker((props) => {
  Meteor.subscribe('singleRoom', props.code);
  Meteor.subscribe('users', props.id);
  return {
    user: Meteor.user(),
    room: Rooms.findOne({}),
  };
})(Blend);
