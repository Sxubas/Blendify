import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './FromPlaylist.css';
import './FromPlaylist.mobile.css';

class FromPlaylist extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className='custom-mood-container'>
        <h5>FromPlaylist</h5>
      </div>
    );
  }

}

FromPlaylist.propTypes = {
  code: PropTypes.string.isRequired
};

export default FromPlaylist;
