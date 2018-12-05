import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';

import MoodParameter from './MoodParameter/MoodParameter.jsx';

import './CustomMood.css';
import './CustomMood.mobile.css';

class CustomMood extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className='custom-mood-container'>
        <h3>CustomMood</h3>
        <hr/>
        <p>Choose which parameters do you want to query songs for</p>
        <MoodParameter enabled title="Energy" description="Speed and loudness of the tracks (0 quiet, 1 energetic)"/>
        <MoodParameter enabled title="Acousticness" description="How acoustic the tracks should be (0 not acoustic, 1 acoustic)"/>
        <MoodParameter enabled title="Instrumentalness" description="The amount of vocal content in the tracks (0 vocal, 1 instrumental)"/>
      </div>
    );
  }

}

CustomMood.propTypes = {
  code: PropTypes.string.isRequired
};

export default CustomMood;
