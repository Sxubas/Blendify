import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Rooms } from '../../api/rooms.js';
import RecentBlend from '../Home/RecentBlend/RecentBlend.jsx';

class Profile extends Component {
  renderHistory() {
    return this.props.history.map((blend, i) =>
      <RecentBlend key={i} blend={blend}/>
    );
  }
  
  render() {
    return (
      this.props.user ?
        <div className="profile">
          <h2>User profile</h2>
          {this.props.user.images[0] ?
            <figure
              className='nav-user-avatar'
              title={this.props.user.display_name}
              style={{ backgroundImage: `url(${this.props.user.images[0].url})` }}
            >
            </figure> :
            <i className='material-icons nav-user-avatar' title={this.props.user.display_name}>
              account_box
            </i>}
          <span>{this.props.user.display_name}</span>          
          <button className='btn black' onClick={() => Meteor.logout()}>Log out</button>
          <h3>history</h3>
          {this.renderHistory()}
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
  Meteor.subscribe('users', props.id);
  Meteor.subscribe('rooms', props.id);
  const user = Meteor.users.findOne({});
  return {
    user: user ? user.profile : undefined,
    history: Rooms.find({}, {sort: {timestamp: -1 }}).fetch(),
  };
})(Profile);
