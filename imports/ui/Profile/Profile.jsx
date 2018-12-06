import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Rooms } from '../../api/rooms.js';

import './Profile.css';
import './Profile.mobile.css';

class Profile extends Component {

  render() {
    return (
      this.props.user && this.props.user.services ?
        <div className="profile-container">
          {this.props.user.services.spotify.images.length > 0 ?
            <figure
              className='profile-user-avatar'
              title={this.props.user.services.spotify.display_name}
              style={{ backgroundImage: `url(${this.props.user.services.spotify.images[0].url})` }}
            >
            </figure> :
            <i className='material-icons profile-user-avatar' title={this.props.user.display_name}>
              account_box
            </i>}
          <h3>{this.props.user.services.spotify.display_name}</h3>
          <button className='btn black' onClick={() => Meteor.logout()}>Log out</button>
        </div> : null
    );
  }
}

Profile.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  history: PropTypes.array,
};

export default withTracker((props) => {
  Meteor.subscribe('rooms', props.id);
  return {
    user: Meteor.user(),
    history: Rooms.find({}, { sort: { timestamp: -1 } }).fetch(),
  };
})(Profile);
