import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { mount, withOptions } from 'react-mounter';
import App from '../imports/ui/App.jsx';
import Home from '../imports/ui/Home/Home.jsx';
import CreateBlend from '../imports/ui/Blends/CreateBlend/CreateBlend.jsx';
import JoinBlend from '../imports/ui/Blends/JoinBlend/JoinBlend.jsx';
import Blends from '../imports/ui/Blends/Blends.jsx';
import NotFound from '../imports/ui/NotFound/NotFound.jsx';
import Blend from '../imports/ui/Blend/Blend.jsx';

import AddTracks from '../imports/ui/Blend/AddTracks/AddTracks/AddTracks.jsx';
import Recommended from '../imports/ui/Blend/AddTracks/Recommended/Recommended.jsx';
import Profile from '../imports/ui/Profile/Profile.jsx';
import FromPlaylist from '../imports/ui/Blend/AddTracks/FromPlaylist/FromPlaylist.jsx';
import TopTracks from '../imports/ui/Blend/AddTracks/TopTracks/TopTracks.jsx';
import RemoveTracks from '../imports/ui/Blend/AddTracks/RemoveTracks/RemoveTracks.jsx';

//Display main.html as the served html
import './main.html';
import CustomMood from '../imports/ui/Blend/AddTracks/CustomMood/CustomMood.jsx';

//Use custom mount function to mount to 'app' instead of 'react-root'
mount = withOptions({
  rootId: 'app'
}, mount);

//Register service worker
//Extracted from https://github.com/NitroBAY/meteor-service-worker
Meteor.startup(() => {
  navigator.serviceWorker.register('/sw.js')
    .then()
    .catch(err => console.log('ServiceWorker registration failed: ', err)); 
});

//Router will mount React app and change it's contents accordingly
FlowRouter.route('/', {
  name: 'home',
  action() {
    mount(App, {
      main: <Home />,
    });
  },
});

FlowRouter.route('/create', {
  name: 'create',
  action() {
    mount(App, {
      main: <CreateBlend />,
    });
  },
});

FlowRouter.route('/join', {
  name: 'join',
  action() {
    mount(App, {
      main: <JoinBlend />,
    });
  },
});

FlowRouter.route('/blend/:id', {
  name: 'blend',
  action(params) {
    mount(App, {
      main: <Blend code={params.id} />
    });
  },
});

FlowRouter.route('/blend/:id/remove_tracks', {
  name: 'blend-remove-tracks',
  action(params) {
    mount(App, {
      main: <RemoveTracks code={params.id} />
    });
  },
});

FlowRouter.route('/blend/:id/add_tracks', {
  name: 'blend-add-tracks',
  action(params) {
    mount(App, {
      main: <AddTracks code={params.id} />
    });
  },
});

FlowRouter.route('/blend/:id/add_tracks/custom_mood', {
  name: 'blend-add-tracks-custom',
  action(params) {
    mount(App, {
      main: <CustomMood code={params.id} />
    });
  },
});

FlowRouter.route('/blend/:id/add_tracks/from_playlist', {
  name: 'blend-add-tracks-from-playlist',
  action(params) {
    mount(App, {
      main: <FromPlaylist code={params.id} />
    });
  },
});

FlowRouter.route('/blend/:id/add_tracks/recommended', {
  name: 'blend-add-tracks-recommended',
  action(params) {
    mount(App, {
      main: <Recommended code={params.id} />
    });
  },
});

FlowRouter.route('/blend/:id/add_tracks/top_songs', {
  name: 'blend-add-tracks-top-songs',
  action(params) {
    mount(App, {
      main: <TopTracks code={params.id} />
    });
  },
});

FlowRouter.route('/profile/:id', {
  name: 'profile',
  action(params) {
    mount(App, {
      main: <Profile id={params.id} />
    });
  },
});

FlowRouter.route('/blends', {
  name: 'blends',
  action() {
    mount(App, {
      main: <Blends />,
    });
  },
});

FlowRouter.notFound = {
  name: 'not-found',
  action() {
    mount(App, {
      main: <NotFound />
    });
  }
};
