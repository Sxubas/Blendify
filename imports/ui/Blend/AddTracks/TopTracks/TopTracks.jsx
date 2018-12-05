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
      Meteor.call('rooms.autoUpdateImageCover', this.props.code);
      this.setState({ loading: false, topTracks: res.items });
    });
  }

  render() {

    if (this.state.loading)
      return (<Loading />);

    return (
      <div className='top-tracks-container'>
        <h3>Adding tracks</h3>
        <hr/>
        <TrackSelector code={this.props.code} tracks={this.state.topTracks} />
      </div>
    );
  }

}

TopTracks.propTypes = {
  code: PropTypes.string.isRequired
};

export default TopTracks;
