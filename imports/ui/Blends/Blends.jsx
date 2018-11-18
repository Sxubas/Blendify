import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './Blends.css';

class Blends extends Component {
  render() {
    return (
      <div className='blends-container'>
        <h3>
          Your blends
        </h3>
        <hr/>

      </div>
    );
  }
}

export default Blends;
