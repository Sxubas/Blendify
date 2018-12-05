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

  componentDidMount() {
    for(const blend of this.props.recent) {
      Meteor.call('rooms.updateRoom', blend.code, (err) => {
        if(err) console.log(err);
      });
    }
  }

  render() {
    return (
      <div className='home-container'>
        <h3>Home</h3>
        <hr />
        <h4>Recently joined</h4>
        <div className='recent-blends-container'>
          {this.props.recent && this.props.recent.map(el =>
            <RecentBlend key={el._id} blend={el} />
          )}
        </div>
        
        <hr className='dim' />

        <h4>
          Your last blend
        </h4>
        {this.props.user && <LastBlend blend={this.props.last} />}
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
  recent: PropTypes.array,
  last: PropTypes.object,
};

export default withTracker(() => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  const user = Meteor.user();
  if (user) {
    //user = user.profile;
    Meteor.subscribe('rooms', user.profile.id);
  }
  return {
    user,
    recent: Rooms.find({}, { sort: { timestamp: -1 }, limit: 5 }).fetch(),
    last: user ? Rooms.findOne({'owner.id': user.profile.id}, {sort: {timestamp: -1}}) : undefined,
  };
})(Home);
