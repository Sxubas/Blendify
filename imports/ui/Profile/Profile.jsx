import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Rooms } from '../../api/rooms.js';

import './Profile.css';

class Profile extends Component {

  render() {
    return (
      this.props.user &&
        <div className="profile-container">
          {this.props.user.images[0] ?
            <figure
              className='profile-user-avatar'
              title={this.props.user.display_name}
              style={{ backgroundImage: `url(${this.props.user.images[0].url})` }}
            >
            </figure> :
            <i className='material-icons nav-user-avatar' title={this.props.user.display_name}>
              account_box
            </i>}
          <h3>{this.props.user.display_name}</h3>
          <button className='btn black' onClick={() => Meteor.logout()}>Log out</button>
        </div>
    );
  }
}

Profile.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.array,
};

export default withTracker((props) => {
  Meteor.subscribe('users', props.id);
  Meteor.subscribe('rooms', props.id);
  const user = Meteor.users.findOne({});
  return {
    user: user ? user.profile : undefined,
    history: Rooms.find({}, { sort: { timestamp: -1 } }).fetch(),
  };
})(Profile);
