import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './MoodParameter.css';
import './MoodParameter.mobile.css';

class MoodParameter extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className='mood-parameter-container'>
        <div className='mood-parameter-top'>
          <div className='mood-parameter-text'>
            <h4>{this.props.title}</h4>
            <p>{this.props.description}</p>
          </div>
          <i className='material-icons'>{`check_box${ this.props.enabled ? '' : 'outline_blank'}`}</i>
        </div>
        <input type="range"/>
      </div>
    );
  }

}

MoodParameter.propTypes = {
  enabled: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default MoodParameter;
