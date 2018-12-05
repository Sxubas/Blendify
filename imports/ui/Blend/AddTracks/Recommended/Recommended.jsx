import React from 'react';
import PropTypes from 'prop-types';

import './Recommended.css';
import './Recommended.mobile.css';

class Recommended extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className='custom-mood-container'>
        <h5>Recommended</h5>
      </div>
    );
  }

}

Recommended.propTypes = {
  code: PropTypes.string.isRequired
};

export default Recommended;
