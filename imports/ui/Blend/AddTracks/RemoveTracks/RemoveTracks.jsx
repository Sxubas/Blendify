import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './RemoveTracks.css';
import './RemoveTracks.mobile.css';

class RemoveTracks extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className='custom-mood-container'>
        <h5>RemoveTracks</h5>
      </div>
    );
  }

}

RemoveTracks.propTypes = {
  code: PropTypes.string.isRequired
};

export default RemoveTracks;
