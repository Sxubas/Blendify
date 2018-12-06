/* eslint-env mocha *//*global Promise*/
import { Meteor } from 'meteor/meteor';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Factory } from 'meteor/dburles:factory';
import { Rooms } from '../rooms.js';
import Spotify from '../Spotify.js';
import faker  from 'faker';
import chai from 'chai';

if(Meteor.isServer) {
  describe('Rooms', () => {
    describe('Methods', () => {
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

      let meteorUserOriginal = null;
      let meteorUserIdOriginal = null;
      let userId = null;
      let addTracksOriginal = null;
      let addFollowerOriginal = null;
      let getPlaylistOriginal = null;
      let getPlaylistsOriginal = null;

      let user = {
        profile: {
          id: faker.random.alphaNumeric(),
          display_name: faker.internet.userName(),
        },
        services: {
          spotify: {accessToken: faker.random.alphaNumeric()}
        }
      };

      let playlistId = faker.random.alphaNumeric(15);
      let playlist = {
        id: playlistId,
        name: faker.lorem.words(2),
        description: faker.lorem.sentence(),
        owner: {
          id: user.profile.id,
        },
        images: [],
        tracks: {
          items: [],
        },
        followers: [],
        uri: playlistId,
      };

      let playlistId2 = faker.random.alphaNumeric(15);
      let code2 = null;
      while(playlistId2 === playlistId) playlistId2 = faker.random.alphaNumeric(15);
      let playlist2 = {
        id: playlistId2,
        name: faker.lorem.words(2),
        description: faker.lorem.sentence(),
        owner: {
          id: faker.random.alphaNumeric(15),
        },
        images: [],
        tracks: {
          items: [],
        },
        followers: [],
        uri: playlistId2,
      };

      Factory.define('room', Rooms, {
        code: () => makecode(),
        name: () => faker.lorem.words(2),
        description: () => faker.lorem.sentence(),
        id: () => faker.random.alphaNumeric(15),
        owner: () => {return {id: faker.random.alphaNumeric(15)};},
        contributors: () => [{id: faker.random.alphaNumeric(15)}],
        tracks: () => {
          let tracks = [];
          for(let i = 0; i<2; i++) {
            tracks.push({track: {uri: faker.random.alphaNumeric(15)}, user: playlist2.owner});
          }
          return tracks;
        },
        images: [],
        timestamp: () => Date.now(),
      });

      let verifyPlaylist = (userId, playlist) => {
        if(playlist.owner.id === userId) return true;
        return playlist.followers.filter(f => f.id === userId).length>0;
      };

      beforeEach(() => {
        resetDatabase();

        meteorUserOriginal = Meteor.user;
        meteorUserIdOriginal = Meteor.userId;
        addTracksOriginal = Spotify.addTracks;
        addFollowerOriginal = Spotify.addFollower;
        getPlaylistOriginal = Spotify.getPlaylist;
        getPlaylistsOriginal = Spotify.getPlaylists;

        userId = Meteor.users.insert(user);
        //Mock of Meteor.user(), Meteor.userId() and Spotify API methods
        Meteor.user = () => {
          const users = Meteor.users.find({ _id: userId }).fetch();
          if (!users || users.length > 1) {
            throw new Error('Meteor.user() mock cannot find by UserId');
          }
          return users[0];
        };
        Meteor.userId = () => userId;
        Spotify.getPlaylist = (access_token, id) => {
          return new Promise((resolve, reject) => {
            if(playlist.id !== id && playlist2.id !== id) reject(new Meteor.Error('the playlist does not exist'));
            else if(playlist.id === id) {
              if(!verifyPlaylist(access_token, playlist)) reject(new Meteor.Error('Forbidden'));
              else resolve(playlist);
            }
            else if(!verifyPlaylist(access_token, playlist2)) reject(new Meteor.Error('Forbidden'));
            else resolve(playlist2);
          });
        };
        Spotify.getPlaylists = (access_token) => {
          return new Promise((resolve) => {
            let playlists = [];
            if(verifyPlaylist(access_token, playlist)) playlists.push(playlist);
            if(verifyPlaylist(access_token, playlist2)) playlists.push(playlist2);
            resolve(playlists);
          });
        };
        Spotify.addFollower = (access_token, id) => {
          return new Promise((resolve, reject) => {
            if(playlist.id !== id && playlist2.id !== id) reject(new Meteor.Error('the playlist does not exist'));
            else if(playlist.id === id) {
              playlist.followers.push({id: access_token});
              resolve(playlist);
            }
            else {
              playlist2.followers.push({id: access_token});
              resolve(playlist2);
            }
          });
        };
        Spotify.addTracks = (access_token, id, uris) => {
          return new Promise((resolve, reject) => {
            if(playlist.id !== id && playlist2.id !== id) reject(new Meteor.Error('the playlist does not exist'));
            else if(playlist.id === id) {
              if(!verifyPlaylist(access_token, playlist)) reject(new Meteor.Error('Forbidden'));
              else {
                playlist.tracks.items = playlist.tracks.items.concat(uris.map(uri => {return {uri};}));
                resolve(playlist);
              }
            }
            else if(!verifyPlaylist(access_token, playlist2)) reject(new Meteor.Error('Forbidden'));
            else {
              playlist2.tracks.items = playlist2.tracks.items.concat(uris.map(uri => {return {uri};}));
              resolve(playlist);
            }
          });
        };

        const room = Factory.create('room', {id: playlist2.id, owner: {id: playlist2.owner.id}, contributors: [{id: playlist2.owner.id}]});
        playlist2.tracks.items = room.tracks.map(tr => tr.track);
        code2 = room.code;
      });

      afterEach(() => {
        Meteor.users.remove(userId);
        Meteor.user = meteorUserOriginal;
        Meteor.userId = meteorUserIdOriginal;
        Spotify.addTracks = addTracksOriginal;
        Spotify.addFollower = addFollowerOriginal;
        Spotify.getPlaylist = getPlaylistOriginal;
        Spotify.getPlaylists = getPlaylistsOriginal;

        userId = null;
        Rooms.remove();
      });

      it('should create a blend', () => {
        Meteor.call('rooms.create', playlist, (err, res) => {
          chai.assert.isNotOk(err);
          console.log(res);
          chai.assert.strictEqual(res.length, 5);

          const room = Rooms.findOne({code: res});
          chai.assert.strictEqual(room.code, res);
          chai.assert.strictEqual(room.id, playlist.id);
          chai.assert.strictEqual(room.owner.id, user.profile.id);
          chai.assert.strictEqual(room.contributors.length, 1);
          chai.assert.strictEqual(room.contributors[0].id, user.profile.id);
          chai.assert.strictEqual(room.tracks.length, 0);
        });
      });

      it('should add a contributor to a blend', () => {
        Meteor.call('rooms.addContributor', code2, (err, res) => {
          chai.assert.isNotOk(err);
          chai.assert.isString(res);
          chai.assert.strictEqual(res, 'Contributor successfully added');

          const room = Rooms.findOne({code: code2, 'contributors.id': user.profile.id});
          chai.assert.isOk(room);
          chai.assert.strictEqual(room.code, code2);
          chai.assert.strictEqual(room.id, playlist2.id);
          chai.assert.strictEqual(playlist2.tracks.items[0].uri, room.tracks.map(tr => tr.track)[0].uri);
          chai.assert.strictEqual(playlist2.tracks.items[1].uri, room.tracks.map(tr => tr.track)[1].uri);
        });
      });

      it('should update a room according to the spotify playlist', () => {
        playlist2.tracks.items.push({uri: faker.random.alphaNumeric(15)});
        playlist2.followers.push({id: user.id});
        Rooms.update({code: code2}, {$push: {contributors: user}});
        Meteor.call('rooms.updateRoom', code2, (err, res) => {
          chai.assert.isNotOk(err);
          chai.assert.isOk(res);

          const room = Rooms.findOne({code: code2});
          chai.assert.isOk(room);
          chai.assert.strictEqual(room.code, code2);
          chai.assert.strictEqual(room.id, playlist2.id);
          chai.assert.strictEqual(playlist2.tracks.items[0].uri, room.tracks.map(tr => tr.track)[0].uri);
          chai.assert.strictEqual(playlist2.tracks.items[1].uri, room.tracks.map(tr => tr.track)[1].uri);
        });
      });

      it('should add a track to a playlist', () => {
        playlist2.followers.push({id: user.id});
        Rooms.update({code: code2}, {$push: {contributors: user}, $set: {owner: user}});
        let tracks = [{uri: faker.random.alphaNumeric(15)}];
        Meteor.call('rooms.addSongs', code2, tracks, (err) => {
          chai.assert.isNotOk(err);
          Meteor.call('rooms.addSongs2', code2, tracks, (err) => {
            chai.assert.isNotOk(err);
            const room = Rooms.findOne({code: code2});
            console.log(playlist2.tracks.items);
            console.log(room.tracks);
            chai.assert.isOk(room);
            chai.assert.strictEqual(room.code, code2);
            chai.assert.strictEqual(room.id, playlist2.id);
            chai.assert.strictEqual(playlist2.tracks.items[0].uri, room.tracks.map(tr => tr.track)[0].uri);
            chai.assert.strictEqual(playlist2.tracks.items[1].uri, room.tracks.map(tr => tr.track)[1].uri);
            chai.assert.strictEqual(playlist2.tracks.items[2].uri, room.tracks.map(tr => tr.track)[2].uri);
          });
        });
      });

    });
  });
}