import { Meteor } from 'meteor/meteor';
import Spotify from './Spotify';
import {check} from 'meteor/check';

if (Meteor.isServer) {
  Meteor.publish('users', id => {
    return Meteor.users.find({ 'profile.id': id }, { profile: 1 });
  });
}

//Andrés Felipe López: Es buena práctica hacer un check del parámetro que recibe el método, así se evitan problemas de lógica y de seguridad.
Meteor.methods({
  'users.removeUser'(username) {
    check(username, String);
    
    if (!Meteor.users.findOne({ 'profile.id': username })) {
      return new Meteor.Error('The user does not exists');
    }
    Meteor.users.update({ 'profile.id': username }, {});
  },
  'users.getTopTracks'() {
    if (!Meteor.userId()) return new Meteor.Error('Unauthorized');
    if (!Meteor.isServer) return new Meteor.Error('Unauthorized');

    return Spotify.getTopTracksAndArtists(Meteor.user().services.spotify.accessToken);
  },
  'users.getTopArtists'() {
    if (!Meteor.userId()) return new Meteor.Error('Unauthorized');
    if (!Meteor.isServer) return new Meteor.Error('Unauthorized');
    return Spotify.getTopTracksAndArtists(Meteor.user().services.spotify.accessToken, 'artists', 5);
  },
  'users.createPlaylist'(name, description) {
    check(name, String);
    check(description, String);
    
    if (!Meteor.userId()) return new Meteor.Error('Unauthorized');
    if (!Meteor.isServer) return new Meteor.Error('Unauthorized');

    const user = Meteor.user();
    return Spotify.createPlaylist(user.services.spotify.accessToken, user.profile.id, name, description);
  }
});
