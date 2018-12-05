import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Track from './../../Track/Track.jsx';

import './TrackSelector.css';
import './TrackSelector.mobile.css';

class TrackSelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTracks: []      
    };
  }

  selectTrack(track){
    const selectedTracks = this.state.selectedTracks;
    const i = selectedTracks.indexOf(track.id);

    if(i === -1){
      selectedTracks.push(track.id);
    }
    else{
      selectedTracks.splice(i, 1);
    }
    this.setState(selectedTracks);
  }

  selectAll(){
    const selectedTracks = [];

    for(const track of this.props.tracks){
      selectedTracks.push(track.id);
    }

    this.setState({selectedTracks});
  }

  clearAll(){
    this.setState({selectedTracks: []});
  }

  render() {
    return (
      <div className='track-selector-container'>
        <div className='track-selector-top-buttons'>
          <button className='btn white' onClick={() => this.selectAll()}>Select all</button>
          <button className='btn white' onClick={() => this.clearAll()}>Clear all</button>
        </div>
        <div className='track-selector-track-container'>
          {this.props.tracks.map( track => 
            <Track selectable
              selected={this.state.selectedTracks.indexOf(track.id) != -1}
              track={track}
              key={track.id}
              onSelect={() => this.selectTrack(track)}/>
          )}
        </div>

        <div className='track-selector-top-buttons'>
          <button className='btn black' onClick={() => FlowRouter.go(`/blend/${this.props.code}`)}>Cancel</button>
          <button className='btn'>Add songs</button>
        </div>
      </div>
    );
  }

}

TrackSelector.propTypes = {
  code: PropTypes.string.isRequired,
  tracks: PropTypes.array.isRequired
};

export default TrackSelector;
