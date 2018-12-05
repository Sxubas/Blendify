import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Rooms } from '../../api/rooms.js';
import BlendItem from './BlendItem/BlendItem.jsx';

import './Blends.css';
import './Blends.mobile.css';

class Blends extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showingCreated: true,
      showingJoined: true,
      selectedBlend: ''
    };
  }

  render() {
    return (
      <div className='blends-container'>
        <h3>
          Your blends
        </h3>
        <hr />

        <div className='blends-buttons-container'>
          <button onClick={() => FlowRouter.go('join')} className='btn'>Join Blend</button>
          <button onClick={() => FlowRouter.go('create')} className='btn'>Create Blend</button>
        </div>

        <h4>Recent blends</h4>

        <div className='blends-history-filter'>
          <span 
            onClick={() => this.setState({ showingCreated: !this.state.showingCreated })}
            className={this.state.showingCreated ? 'checked' : ''}>
            <i
              className='material-icons'
              checked={this.state.showingCreated}>
              {this.state.showingCreated ? 'check_box' : 'check_box_outline_blank'}
            </i>
            Show created
          </span>
          <span 
            onClick={() => this.setState({ showingJoined: !this.state.showingJoined })}
            className={this.state.showingJoined ? 'checked' : ''}>
            <i
              className='material-icons'
              checked={this.state.showingJoined}>
              {this.state.showingJoined ? 'check_box' : 'check_box_outline_blank'}
            </i>
            Show joined
          </span>
        </div>

        <div className='blends-history-container'>
          {this.props.history && this.props.history.map(blend =>
            this.props.user && ((blend.owner.id===this.props.user.profile.id && this.state.showingCreated) || (blend.owner.id!==this.props.user.profile.id && this.state.showingJoined)) && (<BlendItem 
              blend={blend}
              key={blend._id}
              selectedBlend={this.state.selectedBlend}
              onClick={() => this.setState({ selectedBlend: blend._id })}
              onDblClick={() => FlowRouter.go(`/blend/${blend.code}`)}/>
            ))}
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
  if (user) {
    //user = user.profile;
    Meteor.subscribe('rooms', user.profile.id);
  }
  return {
    user,
    history: Rooms.find({}, { sort: { timestamp: -1 } }).fetch()
  };

})(Blends);
