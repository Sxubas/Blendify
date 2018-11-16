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
            <a className={FlowRouter.getRouteName() === 'create' ? 'nav-item selected' : 'nav-item'} href='/create'>
              <i className='material-icons'>playlist_add</i>
              <span className='nav-item-text'>Create Blend</span>
            </a>
            <a className={FlowRouter.getRouteName() === 'join' ? 'nav-item selected' : 'nav-item'} href='/join'>
              <i className='material-icons'>how_to_vote</i>
              <span className='nav-item-text'>Join Blend</span>
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
