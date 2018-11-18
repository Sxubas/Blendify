import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import LandingPage from './LandingPage/LandingPage.jsx';
import Navigation from './Navigation/Navigation.jsx';

import './App.css';
import './App.mobile.css';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='app-container'>
        {FlowRouter.getRouteName() === 'not-found' && this.props.main}
        {FlowRouter.getRouteName() !== 'not-found' && (this.props.user ?
          <Navigation  main={this.props.main} user={this.props.user}/>
          :
          <LandingPage />
        )}
      </div>
    );
  }
}

App.propTypes = {
  main: PropTypes.object,
  user: PropTypes.object
};

export default withTracker(() => {
  // props here will have `main`, passed from the router
  // anything we return from this function will be *added* to it
  return {
    user: Meteor.user(),
  };
})(App);
