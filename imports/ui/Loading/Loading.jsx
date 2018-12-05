import React from 'react';
import PropTypes from 'prop-types';

import './Loading.css';

class Loading extends React.Component {

  render() {
    return (
      <div className='loading-container'>
        <div className='lds-dual-ring'>
        </div>
        <span>Fetching data...</span>
      </div>
    );
  }

}

Loading.propTypes = {
  
};

export default Loading;
