/*global ServiceConfiguration, process*/
import { Meteor } from 'meteor/meteor';
import '../imports/api/rooms.js';
import '../imports/api/Spotify.js';
import '../imports/api/users.js';

//Existe un bug tratando de autorizar un usuario mediante Facebook. Steps to reproduce bug: 
//1. Open http://blendify.herokuapp.com/ with firefox in mac
//2. Click on get started
//3. Click sign in with facebook
//4. The window changes to a blank screen and stays that way.
//5. If you reload the screen and try to click get started again, a blank window opens.

Meteor.startup(() => {
  // code to run on server at startup  

  if (!process.env.BLENDIFY_SECRET) {
    console.log('******************************');
    console.log('[ERROR] Missing App Secret');
    console.log('******************************');
  }
  else {
    //Configure spotify service
    ServiceConfiguration.configurations.update(
      { 'service': 'spotify' },
      {
        $set: {
          'clientId': '0a945853df304e4698a8e4b91e1f41da',
          'secret': process.env.BLENDIFY_SECRET
        }
      },
      { upsert: true }
    );
  }
});
