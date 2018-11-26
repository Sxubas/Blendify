import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import RecentBlend from './RecentBlend/RecentBlend.jsx';
import LastBlend from './LastBlend/LastBlend.jsx';
import { Rooms } from '../../api/rooms.js';

import './Home.css';
import './Home.mobile.css';

class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  test() {
    Meteor.call('rooms.getPlaylist', (err, res) => {
      if(err) {
        console.log('yaper prro');
        console.log(err);
        return;
      }
      console.log(res);
    });
  }

  render() {
    return (
      <div className='home-container'>
        <h3>Home</h3>
        <hr />
        <h4>Recently joined</h4>
        <button onClick={() => this.test()}>test method</button>
        <div className='recent-blends-container'>
          {this.props.recent && this.props.recent.map(el =>
            <RecentBlend key={el._id} blend={el} />
          )}
        </div>
        
        <hr className='dim' />

        <h4>
          Your last blend
        </h4>
        <LastBlend />

        <hr className='dim'/>

        <div className='home-buttons-container'>
          <button onClick={() => FlowRouter.go('join')} className='btn'>Join Blend</button>
          <button onClick={() => FlowRouter.go('create')} className='btn'>Create Blend</button>
        </div>
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
