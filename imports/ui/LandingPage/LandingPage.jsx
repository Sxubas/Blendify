import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import './Landing.css';
import './Landing.mobile.css';

class LandingPage extends Component {


  signIn() {
    var options = {
      showDialog: true, // Whether or not to force the user to approve the app again if they’ve already done so.
      requestPermissions: ['user-read-email', 'user-top-read', 'playlist-modify-private', 'playlist-modify-public', 'playlist-read-private', 'playlist-read-collaborative']
    };
    Meteor.loginWithSpotify(options, function (err) {
      console.log(err || 'No error');
    });
  }

  render() {
    return (
      <div className='landing-container'>
        <div className='landing-title-container' role='main'>
          <a href='/'><img src="/assets/logo.png" alt="Logo" /></a>
          <div className='landing-title-text-container'>
            <h1>Blendify</h1>
            <h2>Fast and customizable shared Spotify playlists</h2>
            <button aria-label='Get started' className='btn' onClick={() => this.signIn()}>Get started</button>
          </div>
        </div>
      </div>
    );
  }
}

export default LandingPage;
