import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './AddingMethod.css';
import './AddingMethod.mobile.css';

class AddingMethod extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div className='adding-method-container' onClick={() => FlowRouter.go(`/blend/${this.props.code}/add_tracks/${this.props.route}`)}>
        <i className='material-icons'>{this.props.icon}</i>
        <div className='adding-method-content'>
          <h4 className="adding-method-title">{this.props.title}</h4>
          <p className="adding-method-title">{this.props.description}</p>
        </div>
      </div>
    );
  }

}

AddingMethod.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired
};

export default AddingMethod;
