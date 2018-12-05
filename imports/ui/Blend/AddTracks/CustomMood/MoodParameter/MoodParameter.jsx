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
      <div className={`mood-parameter-container ${ this.props.enabled ? '' : 'disabled'}`}>
        <div className='mood-parameter-top'>
          <div className='mood-parameter-text'>
            <h4>{this.props.title}</h4>
            <p>{this.props.description}</p>
          </div>
          <i className='material-icons'
            onClick={this.props.onEnable}>
            {`check_box${ this.props.enabled ? '' : '_outline_blank'}`}
          </i>
        </div>
        <input className='mood-parameter-range' type="range" onChange={event => this.props.onChange(event)} value={this.props.value} min="0" max="100"/>
        <div className='mood-parameter-range-label'>
          <span>{this.props.minLabel}</span>
          <span>{this.props.maxLabel}</span>
        </div>
      </div>
    );
  }

}

MoodParameter.propTypes = {
  enabled: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  minLabel: PropTypes.string.isRequired,
  maxLabel: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onEnable: PropTypes.func.isRequired
};

export default MoodParameter;
