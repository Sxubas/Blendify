import React from 'react';
import PropTypes from 'prop-types';

import './Track.css';
import './Track.mobile.css';

class Track extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  parseDuration(durationMs) {
    const mins = Math.floor(durationMs / 1000.0 / 60);
    let secs = Math.ceil((durationMs / 1000.0 / 60 - mins) * 60);
    if (secs < 10) secs = '0' + secs;
    return `${mins}:${secs}`;
  }

  renderArtists(track) {
    return (
      <div className='artists-container'>
        {track.artists && track.artists.map((artist, i) => {
          if (i === track.artists.length - 1 && i<=4) {
            return (
              <div key={artist.id}>
                <a href={`https://open.spotify.com/artist/${artist.id}`} target="_blank" rel="noopener noreferrer">{artist.name.length>23 ? artist.name.substring(0,21)+'...' : artist.name}</a>
              </div>
            );
          }
          else if(i===4) {
            return (
              <div key={artist.id}>
                <a href={`https://open.spotify.com/artist/${artist.id}`} target="_blank" rel="noopener noreferrer">{artist.name.length>23 ? artist.name.substring(0,21)+'...' : artist.name}</a>
                <span>, ...</span>
              </div>
            );
          }
          else if(i<=4)
            return (
              <div key={artist.id}>
                <a href={`https://open.spotify.com/artist/${artist.id}`} target="_blank" rel="noopener noreferrer">{artist.name.length>23 ? artist.name.substring(0,21)+'...' : artist.name}</a>, </div>
            );
        })}
      </div>
    );
  }

  render() {
    return (
      <div 
        className={`track-item-container ${this.props.selectable ? 'selectable' : ''}`}
        onClick={this.props.selectable ? () => this.props.onSelect() : null}>
        <div className='add-track-item'>
          <div>
            <p>{this.props.track.name}</p>
            {this.renderArtists(this.props.track)}
          </div>
        </div>
        {this.props.selectable ?
          <div className='track-right-content'>
            <i className='material-icons'>{`radio_button_${this.props.selected ? 'checked' : 'unchecked'}`}</i>
          </div>
          :
          <div className='track-right-content'>
            {this.parseDuration(this.props.track.duration_ms)}
          </div>
        }
      </div>
    );
  }

}

Track.propTypes = {
  track: PropTypes.object.isRequired,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  onSelect: PropTypes.func
};

export default Track;
