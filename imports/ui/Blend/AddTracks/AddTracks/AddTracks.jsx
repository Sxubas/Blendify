import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';

import AddingMethod from './AddingMethod.jsx';

import './AddTracks.css';
import './AddTracks.mobile.css';

class AddTracks extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className='adding-tracks-container'>
        <h3>Add tracks</h3>
        <hr />
        <p>Which songs do you want to add to this playlist?</p>

        <AddingMethod title="Top songs" code={this.props.code}
          description="Select a group of songs from your 20 most listened-to songs in spotify"
          icon="trending_up" route="top_songs"/>
        <AddingMethod title="Custom mood" code={this.props.code}
          description="Feeling acoustic? Instrumental? Energetic? We will help you choose"
          icon="queue_music" route="custom_mood"/>
        <AddingMethod title="From a playlist" code={this.props.code}
          description="Choose songs to add from a playlist of yours"
          icon="library_music" route="from_playlist"/>
        <AddingMethod title="Recommendations" code={this.props.code}
          description="Get recommended songs to add based on your top artists and genres"
          icon="explore" route="recommended"/>

        <button className='btn black' onClick={() => FlowRouter.go(`/blend/${this.props.code}`)}>Cancel</button>
      </div>
    );
  }

}

AddTracks.propTypes = {
  code: PropTypes.string.isRequired
};

export default AddTracks;
