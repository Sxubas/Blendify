import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './TopSongs.css';
import './TopSongs.mobile.css';

class TopSongs extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className='custom-mood-container'>
        <h5>TopSongs</h5>
      </div>
    );
  }

}

TopSongs.propTypes = {
  code: PropTypes.string.isRequired
};

export default TopSongs;
