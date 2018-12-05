/*global process, require, Promise*/
import axios from 'axios';
import { Meteor } from 'meteor/meteor';
const base64 = require('base-64');
const queryStr = require('querystring');

const Spotify = {};

Spotify.getTopTracksAndArtists = (access_token, type = 'tracks', limit = 15, time_range = 'medium_term') => {
  //time ranges = long (all time), medium (last ~6 months), short (last 4 weeks)
  return new Promise((resolve, reject) => {
    axios.get(`https://api.spotify.com/v1/me/top/${type}`, {
      params: {
        time_range,
        limit,
        offset: 0
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(response => resolve(response.data) /*Return the requested data*/)
      .catch(err => {
        //If access token expired, refresh it and try again        
        if (err.response.data.error.message === 'The access token expired') {
          console.log('Access token expired, refreshing access token...');
          Spotify.refreshAccessToken()
            //Access token successfully refreshed
            .then(new_access_token => Spotify.getTopTracks(new_access_token, type, limit, time_range))
            //Successful retry
            .then(data => resolve(data))
            //Error refreshing or retrying
            .catch(err => { console.log('Error retrying to refresh access token'); reject(err); });
        }
        else {
          reject(err);
        }
      });
  });
};

Spotify.refreshAccessToken = (userId=undefined) => {
  return new Promise( (resolve, reject) => {
    let rToken = null;
    if(userId){
      //TODO Complete for custom userId
      reject(console.log('[ERROR] NOT IMPLEMENTED FOR CUSTOM ID'));      
    }
    else{
      rToken = Meteor.user().services.spotify.refreshToken;
    }
    const body = {
      grant_type: 'refresh_token',
      refresh_token: rToken
    };

    axios.post('https://accounts.spotify.com/api/token', queryStr.stringify(body), {
      headers:{
        'content-type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${base64.encode(`0a945853df304e4698a8e4b91e1f41da:${process.env.BLENDIFY_SECRET}`)}`
      }
    }).then( response => {
      Meteor.users.update( { _id: Meteor.user()._id}, { $set : {
        'services.spotify.accessToken' : response.data.access_token,
        'services.spotify.scope' : response.data.scope,
        'services.spotify.expiresAt' : Date.now() + 1000*response.data.scope
      }});
      console.log('Access token successfully refreshed.');
      resolve(response.data.access_token);
    }).catch( err => {
      console.log('Error refreshing access token');      
      reject(err);      
    });
  });
};

Spotify.createPlaylist = (access_token, user_id, name, description) => {  
  const body = {
    name,
    description,
    public: false,
    collaborative: true
  };
  return new Promise((resolve, reject) => {
    axios.post(`https://api.spotify.com/v1/users/${user_id}/playlists`, body,{
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(response => resolve(response.data) /*Return the requested data*/)
      .catch(err => {
        //If access token expired, refresh it and try again        
        if (err.response.data.error.message === 'The access token expired') {
          console.log('Access token expired, refreshing access token...');
          Spotify.refreshAccessToken()
            //Access token successfully refreshed
            .then(new_access_token => Spotify.createPlaylist(new_access_token, user_id, name, description))
            //Successful retry
            .then(data => resolve(data))
            //Error refreshing or retrying
            .catch(err => { console.log('Error retrying to refresh access token'); reject(err); });
        }
        else {
          reject(err);
        }
      });
  });
};

Spotify.getPlaylist = (access_token, playlist_id) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://api.spotify.com/v1/playlists/${playlist_id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(response => resolve(response.data) /*Return the requested data*/)
      .catch(err => {
        //If access token expired, refresh it and try again        
        if (err.response.data.error.message === 'The access token expired') {
          console.log('Access token expired, refreshing access token...');
          Spotify.refreshAccessToken()
            //Access token successfully refreshed
            .then(new_access_token => Spotify.getPlaylist(new_access_token, playlist_id))
            //Successful retry
            .then(data => resolve(data))
            //Error refreshing or retrying
            .catch(err => { console.log('Error retrying to refresh access token'); reject(err); });
        }
        else {
          reject(err);
        }
      });
  });
};

Spotify.getPlaylistTracks = (access_token, playlist_id) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(response => resolve(response.data) /*Return the requested data*/)
      .catch(err => {
        //If access token expired, refresh it and try again        
        if (err.response.data.error.message === 'The access token expired') {
          console.log('Access token expired, refreshing access token...');
          Spotify.refreshAccessToken()
            //Access token successfully refreshed
            .then(new_access_token => Spotify.getPlaylistTracks(new_access_token, playlist_id))
            //Successful retry
            .then(data => resolve(data))
            //Error refreshing or retrying
            .catch(err => { console.log('Error retrying to refresh access token'); reject(err); });
        }
        else {
          reject(err);
        }
      });
  });
};

Spotify.addTracks = (access_token, playlist_id, uris) => {// TODO: handle token expired
  return new Promise((resolve, reject) => {
    const body = {
      uris,
    };
    axios.post(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(response => resolve(response.data) /*Return the requested data*/)
      .catch(err => {
        //If access token expired, refresh it and try again        
        if (err.response.data.error.message === 'The access token expired') {
          console.log('Access token expired, refreshing access token...');
          Spotify.refreshAccessToken()
            //Access token successfully refreshed
            .then(new_access_token => Spotify.addTracks(new_access_token, playlist_id, uris))
            //Successful retry
            .then(data => resolve(data))
            //Error refreshing or retrying
            .catch(err => { console.log('Error retrying to refresh access token'); reject(err); });
        }
        else {
          reject(err);
        }
      });
  });
};

Spotify.removeTracks = (access_token, playlist_id, tracks) => {
  return new Promise((resolve, reject) => {
    const body = {
      tracks
    };
    axios.delete(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      },
      data: body
    })
      .then(response => resolve(response.data))
      .catch(err => {
        //If access token expired, refresh it and try again        
        if (err.response.data.error.message === 'The access token expired') {
          console.log('Access token expired, refreshing access token...');
          Spotify.refreshAccessToken()
            //Access token successfully refreshed
            .then(new_access_token => Spotify.removeTracks(new_access_token, playlist_id, tracks))
            //Successful retry
            .then(data => resolve(data))
            //Error refreshing or retrying
            .catch(err => { console.log('Error retrying to refresh access token'); reject(err); });
        }
        else {
          reject(err);
        }
      });
  });
};

Spotify.addFollower = (access_token, playlist_id) => {
  return new Promise((resolve, reject) => {
    const body = {
      public: false,
    };
    axios.put(`https://api.spotify.com/v1/playlists/${playlist_id}/followers`, body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(response => resolve(response.data) /*Return the requested data*/)
      .catch(err => {
        //If access token expired, refresh it and try again        
        if (err.response.data.error.message === 'The access token expired') {
          console.log('Access token expired, refreshing access token...');
          Spotify.refreshAccessToken()
            //Access token successfully refreshed
            .then(new_access_token => Spotify.addFollower(new_access_token, playlist_id))
            //Successful retry
            .then(data => resolve(data))
            //Error refreshing or retrying
            .catch(err => { console.log('Error retrying to refresh access token'); reject(err); });
        }
        else {
          reject(err);
        }
      });
  });
};

Spotify.getAvailableGenres = (access_token) => {
  return new Promise((resolve, reject) => {
    axios.get('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(response => resolve(response.data) /*Return the requested data*/)
      .catch(err => {
        //If access token expired, refresh it and try again        
        if (err.response.data.error.message === 'The access token expired') {
          console.log('Access token expired, refreshing access token...');
          Spotify.refreshAccessToken()
            //Access token successfully refreshed
            .then(new_access_token => Spotify.getAvailableGenres(new_access_token))
            //Successful retry
            .then(data => resolve(data))
            //Error refreshing or retrying
            .catch(err => { console.log('Error retrying to refresh access token'); reject(err); });
        }
        else {
          reject(err);
        }
      });
  });
};

Spotify.getRecommendations = (access_token, seed_artists, seed_genres, target_acousticness, target_danceability, target_energy, target_instrumentalness, target_popularity, target_speechiness, target_valence) => {
  //https://api.spotify.com/v1/recommendations
  return new Promise((resolve, reject) => {
    axios.get('https://api.spotify.com/v1/recommendations', {
      params: {
        seed_artists,
        seed_genres,
        target_acousticness,
        target_danceability,
        target_energy,
        target_instrumentalness,
        target_popularity,
        target_speechiness,
        target_valence,
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(response => resolve(response.data))
      .catch(err => {
        //If access token expired, refresh it and try again        
        if (err.response.data.error.message === 'The access token expired') {
          console.log('Access token expired, refreshing access token...');
          Spotify.refreshAccessToken()
            //Access token successfully refreshed
            .then(new_access_token => Spotify.getRecommendations(new_access_token, seed_genres))
            //Successful retry
            .then(data => resolve(data))
            //Error refreshing or retrying
            .catch(err => { console.log('Error retrying to refresh access token'); reject(err); });
        }
        else {
          reject(err);
        }
      });
  });
};

Spotify.getPlaylists = (access_token) => {
  return new Promise((resolve, reject) => {
    axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    })
      .then(response => resolve(response.data))
      .catch(err => {
        //If access token expired, refresh it and try again        
        if (err.response.data.error.message === 'The access token expired') {
          console.log('Access token expired, refreshing access token...');
          Spotify.refreshAccessToken()
            //Access token successfully refreshed
            .then(new_access_token => Spotify.getPlaylists(new_access_token))
            //Successful retry
            .then(data => resolve(data))
            //Error refreshing or retrying
            .catch(err => { console.log('Error retrying to refresh access token'); reject(err); });
        }
        else {
          reject(err);
        }
      });
  });
};

export default Spotify;
