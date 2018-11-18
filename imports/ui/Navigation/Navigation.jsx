import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './Navigation.css';
import './Navigation.mobile.css';

class Navigation extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <nav className='app-nav' role='navigation'>
          <div className='nav-top-container'>
            <div className='title-logo-container'>
              <a href='/'><img src='/assets/logo.png'></img></a>
              <div>
                <h1 onClick={() => FlowRouter.go('home')}>Blendify</h1>
              </div>
            </div>
            <a className={FlowRouter.getRouteName() === 'home' ? 'nav-item selected' : 'nav-item'} href='/'>
              <i className='material-icons'>home</i>
              <span className='nav-item-text'>Home</span>
            </a>
            <a className={FlowRouter.getRouteName() === 'profile' ? 'nav-item selected' : 'nav-item'} href={`/profile/${this.props.user.profile.id}`}>
              <i className='material-icons'>account_circle</i>
              <span className='nav-item-text'>Profile</span>
            </a>
            <a className={FlowRouter.getRouteName() === 'blends' ? 'nav-item selected' : 'nav-item'} href='/blends'>
              {
                FlowRouter.getRouteName() === 'blends' ?
                  <i><svg viewBox="0 0 512 512" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M311.873 77.46l166.349 373.587-39.111 17.27-166.349-373.587zM64 463.746v-384h42.666v384h-42.666zM170.667 463.746v-384h42.667v384h-42.666z" fill="currentColor"></path></svg></i>
                  :
                  <i><svg viewBox="0 0 512 512" width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M291.301 81.778l166.349 373.587-19.301 8.635-166.349-373.587zM64 463.746v-384h21.334v384h-21.334zM192 463.746v-384h21.334v384h-21.334z" fill="currentColor"></path></svg></i>
              }
              <span className='nav-item-text'>Your blends</span>
            </a>
          </div>
          {this.props.user &&
            <div className='nav-bottom-container'>
              <a href={`/profile/${this.props.user.profile.id}`} className='nav-user-link'>
                {this.props.user.profile.images[0] ?
                  <figure
                    className='nav-user-avatar'
                    title={this.props.user.profile.display_name}
                    style={{ backgroundImage: `url(${this.props.user.profile.images[0].url})` }}
                  >
                  </figure> :
                  <i className='nav-user-avatar material-icons' title={this.props.user.profile.display_name}>
                    account_box
                  </i>}
                <span>{this.props.user.profile.display_name}</span>
              </a>
            </div>}
        </nav>
        <div className='app-content-container' role='main'>
          {this.props.main}
        </div>
      </div>
    );
  }
}

Navigation.propTypes = {
  main: PropTypes.object,
  user: PropTypes.object
};

export default Navigation;
