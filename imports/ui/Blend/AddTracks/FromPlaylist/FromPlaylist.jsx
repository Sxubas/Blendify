import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import Loading from './../../../Loading/Loading.jsx';
import TrackSelector from './../TrackSelector/TrackSelector.jsx';

import './FromPlaylist.css';
import './FromPlaylist.mobile.css';

class FromPlaylist extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      playlists: [],
      selected: undefined,
      loading: true,
    };
  }

  componentDidMount() {
    Meteor.call('rooms.getPlaylists', (err, res) => {
      if (err) {
        alert(err);
        return;
      }
      console.log(res);
      this.setState({ loading: false, playlists: res.items });
    });
  }

  getImageSrc(playlist) {
    if (playlist.images) {
      //Inverse loop to pick smallest image 
      for (let i = playlist.images.length - 1; i >= 0; i--) {
        return playlist.images[i].url;
      }
    }
  }

  selectPlaylist(i) {
    this.setState({ loading: true });
    Meteor.call('rooms.getPlaylistTracks', this.state.playlists[i].id, (err, res) => {
      if (err) {
        alert(err);
        return;
      }
      console.log(res);
      this.setState({ selected: { ...res, name: this.state.playlists[i].name }, loading: false });
    });
  }

  render() {
    if (this.state.loading)
      return (<Loading />);
    else if (!this.state.selected) {
      return (
        <div className='from-playlist-container'>
          <h3>Select a playlist</h3>
          <hr />
          {this.state.playlists.map((playlist, i) =>
            <div key={playlist.id} className='playlist-item-content' onClick={() => this.selectPlaylist(i)}>
              {(playlist.images && playlist.images.length > 0) ?
                <div
                  style={{ backgroundImage: `url(${this.getImageSrc(playlist)})` }}
                  className='playlist-item-cover-art' /> :
                <i className='material-icons playlist-cover-icon'>photo</i>}

              <div className="playlist-item-title">
                {playlist.name}
              </div>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className='from-playlist-container'>
        <h5>Add from {this.state.selected.name}</h5>
        <hr />
        <TrackSelector code={this.props.code} tracks={this.state.selected.items.map(item => item.track)} />
      </div>
    );
  }

}

FromPlaylist.propTypes = {
  code: PropTypes.string.isRequired
};

export default FromPlaylist;
