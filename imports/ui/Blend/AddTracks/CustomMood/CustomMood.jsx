import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';

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
        <h5>CustomMood</h5>
      </div>
    );
  }

}

CustomMood.propTypes = {
  code: PropTypes.string.isRequired
};

export default CustomMood;
