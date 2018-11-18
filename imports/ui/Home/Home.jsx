import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import RecentBlend from './RecentBlend/RecentBlend.jsx';
import { Rooms } from '../../api/rooms.js';

import './Home.css';
import './Home.mobile.css';

class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='home-container'>
        <h3>Home</h3>
        <hr />
        <h4>Recently joined</h4>
        <div style={{width: '100%', overflowX : 'scroll'}}>
          <div className='recent-blends-container'>
            {this.props.recent && this.props.recent.map(el =>
              <RecentBlend key={el._id} blend={el} />
            )}
          </div>
        </div>
        <button className='btn'>Join Blend</button>
        <button className='btn'>Create Blend</button>
      </div>
    );
  }
}

Home.propTypes = {
  user: PropTypes.object,
  recent: PropTypes.array
};

export default withTracker(() => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  const user = Meteor.user();
  if (user)
    Meteor.subscribe('rooms', user.profile.id);
  return {
    user,
    recent: Rooms.find({}, { sort: { timestamp: -1 }, limit: 5 }).fetch()
  };
})(Home);
