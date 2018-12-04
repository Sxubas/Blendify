import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Rooms } from '../../api/rooms.js';

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

  addTracks() {
    //If tracks havent been requested
    if (this.state.tracksRetrieved.length === 0) {
      Meteor.call('users.getTopTracks', (err, res) => {
        if (err) {
          alert(err);
          return;
        }
        Meteor.call('rooms.autoUpdateImageCover', this.props.code);
        this.setState({ showTracksToAdd: true, edit: false, tracksToAdd: res.items, tracksRetrieved: res.items.slice() });
      });
    }
    //Tracks have already been fetched, do not call API
    else {
      this.setState({ showTracksToAdd: true, edit: false, tracksToAdd: this.state.tracksRetrieved.slice() });
    }
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
      tracksToRemove: this.state.tracksToRemove.concat([{uri, positions: [i]}])
    });
  }

  submitTracksToAdd() {
    Meteor.call('rooms.addSongs', this.props.code, this.state.tracksToAdd, (err) => {
      if (err) {
        alert(err);
        return;
      }
      this.setState({ showTracksToAdd: false });
    });
  }

  submitTracksToRemove() {
    console.log(this.state.tracksToRemove);
    Meteor.call('rooms.removeTracks', this.props.room.code, this.state.tracksToRemove, (err) => {
      if(err) {
        console.log(err);
        alert(err);
      }
      Meteor.call('rooms.updateRoom', this.props.room.code, (err) => {
        if(err) {
          console.log(err);
          alert(err);
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

  parseDuration(durationMs) {
    const mins = Math.floor(durationMs / 1000.0 / 60);
    let secs = Math.ceil((durationMs / 1000.0 / 60 - mins) * 60);
    if (secs < 10) secs = '0' + secs;
    return `${mins}:${secs}`;
  }

  render() {
    return (this.props.room ?
      <div className="blend-container">
        <div className='blend-title-container'>
          {/* Blend image rendering */}
          {(this.props.room.images && this.props.room.images.length > 0) ||
            (this.props.room.tracks && this.props.room.tracks.length > 0) ?
            <img src={this.getImageSrc(this.props.room)} className='blend-title-image' alt="Playlist image" /> :
            <i className='material-icons blend-title-image'>photo</i>
          }
          <div className='blend-title-text'>

            <h3 className="blend-name">{this.props.room.name}</h3>
            <span>Created by <a href={`/profile/${this.props.room.owner.id}`}>{this.props.room.owner.display_name}</a></span>
            
            {/* Contributors rendering */}
            {this.props.room.contributors.length > 1 ?
              <span className='blend-title-contributors' onClick={() => this.setState({ showingContributors: !this.state.showingContributors })}>
                {this.state.showingContributors ? 'Hide contributors' : `${this.props.room.contributors.length} Contributors`}
              </span> :
              <span>No contributors yet</span>}

            {this.state.showingContributors && this.renderContributors()}

            {!this.state.showTracksToAdd && !this.state.edit && <button onClick={() => this.addTracks()} className='btn white small'>add tracks</button>}
            {!this.state.showTracksToAdd && !this.state.edit && <button onClick={() => this.edit()} className='btn white small'>edit</button>}
          </div>
        </div>
        <div className='track-list-container'>

          {this.state.showTracksToAdd &&
            <div className='add-tracks-container'>
              {this.state.tracksToAdd.map((track, i) =>
                <div className='track-item-container' key={i}>
                  <div className='add-track-item'>
                    <i className='material-icons remove-track' tabIndex='0' onClick={() => this.deleteTrackToAdd(i)}>clear</i>
                    <div>
                      <p>{i + 1}. {track.name}</p>
                      {this.renderArtists(track)}
                    </div>
                  </div>
                  <div className='track-duration'>{this.parseDuration(track.duration_ms)}</div>
                </div>
              )}
              <div className='add-tracks-btn-container'>
                <button className='btn' onClick={() => this.submitTracksToAdd()}>Add tracks</button>
                <button className='btn black' onClick={() => this.setState({ showTracksToAdd: false })}>Cancel</button>
              </div>
            </div>}

          {!this.state.showTracksToAdd && !this.state.edit && /*Do not show when adding tracks*/
            (this.props.room.tracks && this.props.room.tracks.length > 0 ?
              this.props.room.tracks.map((track, i) =>
                <div className='track-item-container' key={i}>
                  <div>
                    <p>{track.track.name}</p>
                    {this.renderArtists(track.track)}
                  </div>
                  <div className='track-duration'>{this.parseDuration(track.track.duration_ms)}</div>
                </div>
              ) :
              <p>There are not songs in the list yet.</p>)
          }

          {this.state.edit &&
            (<div className='add-tracks-container'>
              {this.props.room.tracks.map((track, i) => 
                this.state.tracksToRemove.filter(tr => tr.uri===track.track.uri && tr.positions[0]===i).length===0 && 
                (<div className='track-item-container' key={i}>
                  <div className='add-track-item'>
                    <i className='material-icons remove-track' tabIndex='0' onClick={() => this.deleteTrack(track.track.uri, i)}>clear</i>
                    <div>
                      <p>{track.track.name}</p>
                      {this.renderArtists(track.track)}
                    </div>
                  </div>
                  <div className='track-duration'>{this.parseDuration(track.track.duration_ms)}</div>
                </div>)
              )}
              <div className='add-tracks-btn-container'>
                <button className='btn' onClick={() => this.submitTracksToRemove()}>Save changes</button>
                <button className='btn black' onClick={() => this.setState({ edit: false })}>Cancel</button>
              </div>
              
            </div>)
          }
        </div>
      </div> : null
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

  renderArtists(track) {
    return (
      <div className='artists-container'>
        {track.artists.map((artist, i) => {
          if (i === track.artists.length - 1) {
            return (
              <div key={artist.id}>
                <a href={`https://open.spotify.com/artist/${artist.id}`} target="_blank" rel="noopener noreferrer">{artist.name}</a>
              </div>
            );
          }

          return (
            <div key={artist.id}>
              <a href={`https://open.spotify.com/artist/${artist.id}`} target="_blank" rel="noopener noreferrer">{artist.name}</a>, </div>
          );
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
  return {
    user: Meteor.user(),
    room: Rooms.findOne({}),
  };
})(Blend);
