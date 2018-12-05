import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import Track from './../../Track/Track.jsx';

import './TrackSelector.css';
import './TrackSelector.mobile.css';

class TrackSelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTracks: this.props.tracks.map(() => false)
    };
  }

  selectTrack(i){
    const selectedTracks = this.state.selectedTracks;
    selectedTracks[i] = !selectedTracks[i];
    this.setState({selectedTracks});
  }

  selectAll(){
    const selectedTracks = this.state.selectedTracks.map(() => true);
    this.setState({selectedTracks});
  }

  clearAll(){
    const selectedTracks = this.state.selectedTracks.map(() => false);
    this.setState({selectedTracks});
  }

  addTracks() {
    const tracksToAdd = this.props.tracks.filter((_, i) => this.state.selectedTracks[i]);
    if(tracksToAdd.length>0) {
      Meteor.call('rooms.addSongs', this.props.code, tracksToAdd, (err) => {
        if(err) {
          console.log(err);
          alert(err);
        }
        Meteor.call('rooms.updateRoom', this.props.code, (err) => {
          if(err) {
            console.log(err);
            alert(err);
          }
        });
        FlowRouter.go(`/blend/${this.props.code}`);
      });
    }
    else {
      FlowRouter.go(`/blend/${this.props.code}`);
    }
    console.log(tracksToAdd);
  }

  removeTracks(){
    
  }

  render() {
    return (
      <div className='track-selector-container'>
        <div className='track-selector-top-buttons'>
          <button className='btn white' onClick={() => this.selectAll()}>Select all</button>
          <button className='btn white' onClick={() => this.clearAll()}>Clear all</button>
        </div>
        <div className='track-selector-track-container'>
          {this.props.tracks.map( (track, i) => 
            <Track selectable
              selected={this.state.selectedTracks[i]}
              track={track}
              key={i}
              onSelect={() => this.selectTrack(i)}/>
          )}
        </div>

        <div className='track-selector-top-buttons'>
          <button className='btn black' onClick={() => FlowRouter.go(`/blend/${this.props.code}/add_tracks`)}>Cancel</button>
          <button className='btn' onClick={this.props.removing ? () => this.removeTracks() : () => this.addTracks()}>
            {this.props.removing ? 'Remove tracks' : 'Add tracks'}
          </button>
        </div>
      </div>
    );
  }

}

TrackSelector.propTypes = {
  code: PropTypes.string.isRequired,
  tracks: PropTypes.array.isRequired,
  removing: PropTypes.bool
};

export default TrackSelector;
