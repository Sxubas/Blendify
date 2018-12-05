import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Loading from './../../../Loading/Loading.jsx';
import TrackSelector from './../TrackSelector/TrackSelector.jsx';

import './TopTracks.css';
import './TopTracks.mobile.css';

class TopTracks extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      topTracks: [],
      loading: true,
      selectedTracks: []
    };
  }

  componentDidMount() {
    Meteor.call('users.getTopTracks', (err, res) => {
      if (err) {
        alert(err);
        return;
      }
      Meteor.call('rooms.updateRoom', this.props.code, () => this.setState({ loading: false, topTracks: res.items }));
    });
  }

  render() {

    if (this.state.loading)
      return (<Loading />);

    return (
      <div className='top-tracks-container'>
        <h3>Top tracks</h3>
        <hr/>
        <p className='top-tracks-description'>These are your most listened-to tracks in the last 6 months. Select those which you want to add to this playlist </p>
        <TrackSelector code={this.props.code} tracks={this.state.topTracks} />
      </div>
    );
  }

}

TopTracks.propTypes = {
  code: PropTypes.string.isRequired
};

export default TopTracks;
