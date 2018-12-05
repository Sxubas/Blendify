/* global Promise */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Spotify from './Spotify';

export const Rooms = new Mongo.Collection('rooms');

const makecode = () => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = 0; i < 2; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  let number = Math.floor(Math.random()*1000);
  if(number<10) number = '00'+number;
  else if(number<100) number = '0'+number;
  return text+number;
};

if(Meteor.isServer) {
  Meteor.publish('rooms', (user) => {
    return Rooms.find({'contributors.id': user});
  });
  Meteor.publish('singleRoom', code => {
    if(!Meteor.userId) return new Meteor.Error('Not authorized');
    const user = Meteor.user().profile.id;
    return Rooms.find({code, 'contributors.id': user});
  });
  Meteor.publish('myRooms', () => {
    if(!Meteor.userId) return new Meteor.Error('Not authorized');
    const user = Meteor.user().profile.id;
    return Rooms.find({'owner.id': user});
  });
}

Meteor.methods({
  'rooms.create'(playlist) {
    if(!Meteor.userId()) return new Meteor.Error('Not authorized');
    let owner = Meteor.user().profile;
    if(owner.id !== playlist.owner.id) return new Meteor.Error('Not authorized');
    let code = makecode();
    while(Rooms.findOne({code})) code = makecode();
    Rooms.insert({
      name: playlist.name,
      code,
      description: playlist.description,
      id: playlist.id,
      owner,
      contributors: [owner],
      tracks: [],
      images: playlist.images,
      timestamp: Date.now(),
    });
    return code;
  },
  'rooms.addSongs'(code, songslist) {
    let user = Meteor.user();
    if(!user) return new Meteor.Error('Not authorized');
    let tracks = songslist.map(s => {
      return{track: s, user: user.profile};
    });
    let uris = songslist.map(s => {
      return s.uri;
    });
    const room = Rooms.findOne({code});
    if(!room) return new Meteor.Error('The room does not exist');
    const owner = Meteor.users.findOne({'profile.id': room.owner.id});
    Spotify.addTracks(owner.services.spotify.accessToken, room.id, uris)
      .then((res) => {
        console.log(res);
        Rooms.update({code}, {
          $push: {tracks: {$each: tracks}}
        });
      })
      .catch((err) => console.log(err));
  },
  'rooms.addSongs2'(code, songslist) {
    let user = Meteor.user();
    if(!user) return new Meteor.Error('Not authorized');
    if(!Rooms.findOne({code, 'contributors.id': user.profile.id})) {
      return new Meteor.Error('Not authorized');
    }
    let tracks = songslist.map(s => {
      return{track: s, user: user.profile};
    });
    Rooms.update({code}, {
      $push: {tracks: {$each: tracks}}
    });
  },
  'rooms.addContributor'(code) {
    if(!Meteor.userId()) return new Meteor.Error('Not authorized');
    const user = Meteor.user();
    const room = Rooms.findOne({code});
    if(!room) return new Meteor.Error('The blend does not exist');
    if(room.contributors.filter(contr => contr.id===user.profile.id).length === 0) {
      return new Promise((resolve, reject) => {
        Spotify.addFollower(user.services.spotify.accessToken, room.id)
          .then(() => {
            Rooms.update({code}, {$push: {contributors: user.profile}}, err => {
              if(err) {
                console.log(err);
                reject(err);
              }
              else {
                resolve('Contributor successfully added');
              }
            });
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });

      });
    }
    return new Meteor.Error('You are already a contributor');
  },
  'rooms.autoUpdateImageCover'(code) {
    if(!Meteor.userId()) return new Meteor.Error('Not authorized');
    const user = Meteor.user();
    const room = Rooms.findOne({code, 'contributors.id': user.profile.id});
    if(!room) return new Meteor.Error('Not authorized');
    const owner = Meteor.users.findOne({'profile.id': room.owner.id});
    Spotify.getPlaylist(owner.services.spotify.accessToken, room.id)
      .then(res => {
        Rooms.update({code}, {$set: {images: res.images}});
      })
      .catch(err => {
        console.log('wat');
        console.log(err);
      });
  },
  'rooms.getAvailableGenres'() {
    if(!Meteor.userId()) return new Meteor.Error('Not authorized');
    const user = Meteor.user();
    return Spotify.getAvailableGenres(user.services.spotify.accessToken);
  },
  'rooms.getRecommendations'(artists, genres, acousticness, danceability, energy, instrumentalness, popularity, speechiness, valence) {
    if(!Meteor.userId()) return new Meteor.Error('Not authorized');
    const user = Meteor.user();
    return Spotify.getRecommendations(user.services.spotify.accessToken, artists, genres, acousticness, danceability, energy, instrumentalness, popularity, speechiness, valence);
  },
  'rooms.getPlaylists'() {
    if(!Meteor.userId()) return new Meteor.Error('Not authorized');
    const user = Meteor.user();
    return Spotify.getPlaylists(user.services.spotify.accessToken);
  },
  'rooms.removeTracks'(code, uris) {
    if(!Meteor.userId()) return new Meteor.Error('Not authorized');
    const user = Meteor.user();
    const room = Rooms.findOne({code, 'contributors.id': user.profile.id});
    if(!room) return new Meteor.Error('Not Authorized');
    return Spotify.removeTracks(user.services.spotify.accessToken, room.id, uris);
  },
  'rooms.getPlaylist'(code) {
    if(!Meteor.userId()) return new Meteor.Error('Not authorized');
    const user = Meteor.user();
    const room = Rooms.findOne({code, 'contributors.id': user.profile.id});
    if(!room) return new Meteor.Error('Not Authorized');
    return Spotify.getPlaylist(user.services.spotify.accessToken, room.id);
  },
  'rooms.getPlaylistTracks'(id) {
    if(!Meteor.userId()) return new Meteor.Error('Not authorized');
    const user = Meteor.user();
    return Spotify.getPlaylistTracks(user.services.spotify.accessToken, id);
  },
  'rooms.updateRoom'(code) {
    if(!Meteor.userId()) return new Meteor.Error('Not authorized');
    const user = Meteor.user();
    const room = Rooms.findOne({code, 'contributors.id': user.profile.id});
    if(!room) return new Meteor.Error('Not Authorized');
    return new Promise((resolve, reject) => {
      Spotify.getPlaylists(user.services.spotify.accessToken)
        .then(res => {
          if(res.items.filter(pl => pl.id === room.id).length === 0) {
            Rooms.update({id: room.id}, {$pull: {contributors: {id: user.profile.id}}}, (err) => {
              if(err) {
                console.log('wtf');
                console.log(err);
                reject(err);
              }
              else {
                console.log('vamos');
                reject(new Meteor.Error('The playlist has been deleted'));
              }
            });
          }
          else {
            Spotify.getPlaylist(user.services.spotify.accessToken, room.id)
              .then(r => {
                const tracks = r.tracks.items;
                const toBeDeleted = [];
                const myTracks = [];
                for(let track of tracks) {
                  track = track.track;
                  track.available_markets = undefined;
                  track.album.available_markets = undefined;
                  let added = false;
                  let j = 0;
                  for(; j<room.tracks.length && !added; j++) {
                    const tr = room.tracks[j];
                    if(track.id === tr.id) {
                      added = true;
                      myTracks.push(tr);
                      break;
                    }
                    else {
                      toBeDeleted.push(tr);
                    }
                  }
                  if(!added) {
                    for(let i = 0; i<toBeDeleted.length; i++) {
                      const tr = toBeDeleted[i];
                      if(track.id === tr.id) {
                        myTracks.push(tr);
                        toBeDeleted.splice(i, 1);
                        added = true;
                        break;
                      }
                    }
                    if(!added) {
                      myTracks.push({track, user:room.owner});
                    }
                  }
                }
                Rooms.update({id: room.id}, {$set: {tracks: myTracks, images: r.images}}, (err) => {
                  if(err) {
                    console.log('wtf2');
                    reject(err);
                  }
                  else resolve(r);
                });
              })
              .catch(err => {
                reject(err);
              });
          }
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  },
});
