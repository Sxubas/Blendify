import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Rooms } from '../../api/rooms.js';
import BlendItem from './BlendItem/BlendItem.jsx';

import './Blends.css';

class Blends extends Component {

  constructor(props){
    super(props);
    this.state = {
      showingCreated: true,
      showingJoined: true
    };
  }

  render() {
    return (
      <div className='blends-container'>
        <h3>
          Your blends
        </h3>
        <hr/>

        <div className='blends-buttons-container'>
          <button onClick={() => FlowRouter.go('join')} className='btn'>Join Blend</button>
          <button onClick={() => FlowRouter.go('create')} className='btn'>Create Blend</button>
        </div>

        <h4>Recent blends</h4>

        <div className='blends-history-filter'>
          <label>
            Show created
            <input 
              type='checkbox'
              onChange={ event => this.setState({ showingCreated: event.target.checked })}
              checked={this.state.showingCreated}>
            </input>
          </label>
          <label>
            Show joined
            <input 
              type='checkbox'
              checked={this.state.showingJoined} 
              onChange={ event => this.setState({ showingJoined : event.target.checked })}>
            </input>
          </label>
        </div>

        <div className='blends-history-container'>
          {this.props.history && this.props.history.map( blend => 
            <BlendItem blend={blend} key={blend._id}/>
          )}
        </div>
      </div>
    );
  }
}

Blends.propTypes = {
  user: PropTypes.object,
  history: PropTypes.array
};

export default withTracker(() => {
  const user = Meteor.user();
  if (user)
    Meteor.subscribe('rooms', user.profile.id);
  return {
    user,
    history: Rooms.find({}, { sort: { timestamp: -1 } }).fetch()
  };

})(Blends);
