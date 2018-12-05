import React from 'react';
import PropTypes from 'prop-types';

import TrackSelector from '../TrackSelector/TrackSelector.jsx';
import Loading from '../../../Loading/Loading.jsx';

import './Recommended.css';
import './Recommended.mobile.css';

class Recommended extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      recommendedTracks: [],
      loading: true
    };
  }

  render() {

    if (this.state.loading)
      return (<Loading />);

    return (
      <div className='recommended-container'>
        <h3>Recommended tracks</h3>
        <hr/>
        <p className='recommended-description'>Here are some tracks based on your top artists and genres in spotify. Not convinced by any track? Refresh! </p>
        <TrackSelector />
      </div>
    );
  }

}

Recommended.propTypes = {
  code: PropTypes.string.isRequired
};

export default Recommended;
