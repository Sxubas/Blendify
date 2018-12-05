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
      if(err) {
        alert(err);
        return;
      }
      console.log(res);
      this.setState({loading: false, playlists: res.items});
    });
  }

  selectPlaylist(i) {
    this.setState({loading: true});
    Meteor.call('rooms.getPlaylistTracks', this.state.playlists[i].id, (err, res) => {
      if(err) {
        alert(err);
        return;
      }
      console.log(res);
      this.setState({selected: res, loading: false});
    });
  }

  render() {
    if (this.state.loading)
      return (<Loading />);
    else if(!this.state.selected) {
      //TODO: render playlists
      return(
        <div>
          {this.state.playlists.map((playlist, i) => 
            <button key={playlist.id} onClick={() => this.selectPlaylist(i)}>{playlist.name}</button>
          )}
        </div>
      );
    }
    return (
      <div className='custom-mood-container'>
        <h5>FromPlaylist</h5>
        <hr/>
        <TrackSelector code={this.props.code} tracks={this.state.selected.items.map(item => item.track)} />
      </div>
    );
  }

}

FromPlaylist.propTypes = {
  code: PropTypes.string.isRequired
};

export default FromPlaylist;
