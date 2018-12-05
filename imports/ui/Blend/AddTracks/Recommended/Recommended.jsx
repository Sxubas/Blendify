import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import TrackSelector from '../TrackSelector/TrackSelector.jsx';
import Loading from '../../../Loading/Loading.jsx';

import './Recommended.css';
import './Recommended.mobile.css';

class Recommended extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      recommendedTracks: [],
      loading: true
    };
  }

  componentDidMount() {
    Meteor.call('users.getTopArtists', (err, res) => {
      if(err) {
        console.log(err);
        alert(err);
        return;
      }
      Meteor.call('rooms.getRecommendations', this.processArtists(res.items), 
        undefined, undefined, undefined, undefined, 
        undefined, undefined, undefined, undefined, (err, res) => {
          if(err) {
            alert(err);
            FlowRouter.go(`/blend/${this.props.code}/add_tracks`);
            return;
          }
          this.setState({recommendedTracks: res.tracks, loading: false});
        });
    });
  }

  processArtists(artists) {
    let str = '';
    for(const i in artists){
      str += artists[i].id;
      if(i<artists.length-1) str += ',';
    }
    return str;
  }

  render() {

    if (this.state.loading)
      return (<Loading />);

    return (
      <div className='recommended-container'>
        <h3>Recommended tracks</h3>
        <hr/>
        <p className='recommended-description'>Here are some tracks based on your top artists and genres in spotify. Not convinced by any track? Refresh! </p>
        <TrackSelector code={this.props.code} tracks={this.state.recommendedTracks}/>
      </div>
    );
  }

}

Recommended.propTypes = {
  code: PropTypes.string.isRequired
};

export default Recommended;
