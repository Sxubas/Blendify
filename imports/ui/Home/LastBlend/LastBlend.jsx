import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './LastBlend.css';
import './LastBlend.mobile.css';

class LastBlend extends React.Component {

  render() {
    return (
      <div className='last-blend-container'>
        <div className='last-top-container'>
          <div
            style={{ backgroundImage: `url(https://i.scdn.co/image/853ad138f6fa3530cbb675e7b234549cd1740c39)` }}
            className='last-cover-art'>
          </div>
          <h5>
            Some Test and long names
          </h5>
        </div>
        <div className='last-bottom-container'>
          <p>Code: RV432</p>
          <p>23 Tracks</p>
          <p>4 Contributors</p>
        </div>
      </div>
    );
  }

}

export default LastBlend;
