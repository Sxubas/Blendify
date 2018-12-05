import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Rooms } from '../../../../api/rooms.js';

import TrackSelector from '../TrackSelector/TrackSelector.jsx';

import './RemoveTracks.css';
import './RemoveTracks.mobile.css';

class RemoveTracks extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };

    this.spreadTracks.bind(this);
  }


  submitTracksToRemove() {
    Meteor.call('rooms.removeTracks', this.props.code, this.state.tracksToRemove, (err) => {
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

  spreadTracks() {
    const tracks = [];
    if (this.props.room) {
      for (const obj of this.props.room.tracks) {
        tracks.push(obj.track);
      }
    }
    return tracks;    
  }

  render() {
    return (
      <div className='remove-tracks-container'>
        <h3>Remove tracks</h3>
        <hr />
        <p className='remove-tracks-description'>Select the tracks to remove from the playlist</p>
        <TrackSelector tracks={this.spreadTracks()} removing code={this.props.code} />
      </div>
    );
  }

}

RemoveTracks.propTypes = {
  code: PropTypes.string.isRequired,
  room: PropTypes.object
};

export default withTracker((props) => {
  Meteor.subscribe('singleRoom', props.code);
  return {
    room: Rooms.findOne({}),
  };
})(RemoveTracks);
