import React from 'react';
import PropTypes from 'prop-types';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import MoodParameter from './MoodParameter/MoodParameter.jsx';
import Loading from '../../../Loading/Loading.jsx';
import TrackSelector from '../TrackSelector/TrackSelector.jsx';

import Select from 'react-select';
import genres from './genres.js';

import './CustomMood.css';
import './CustomMood.mobile.css';

const customStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white', color: 'black', width: '100%'})
};

class CustomMood extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      selecting: false,
      selectedGenres: [],
      moodTracks: [],
      energy: {
        enabled: true,
        value: Math.random() * 100
      },
      acousticness: {
        enabled: false,
        value: Math.random() * 100
      },
      dance: {
        enabled: false,
        value: Math.random() * 100
      },
      instrumentalness: {
        enabled: false,
        value: Math.random() * 100
      },
      popularity: {
        enabled: false,
        value: Math.random() * 100
      },
      speechiness: {
        enabled: false,
        value: Math.random() * 100
      },
      happiness: {
        enabled: false,
        value: Math.random() * 100
      },
    };
  }

  onEnableGenerator(parameter) {
    const param = this.state[parameter];
    param.enabled = !param.enabled;
    const update = {};
    update[parameter] = param;
    this.setState(update);
  }

  onChangeGenerator(event, parameter) {
    const param = this.state[parameter];
    param.value = parseInt(event.target.value);
    const update = {};
    update[parameter] = param;
    this.setState(update);
  }

  buildGenreString(){
    let string = '';

    for(const genre of this.state.selectedGenres){
      string += genre.value + ',';
    }

    string = string.substring(0, string.length-1);

    return string;
  }

  moodSearch() {
    this.setState({ loading: true });
    const genres = this.buildGenreString();
    Meteor.call('rooms.getRecommendations', undefined, genres,
      this.state.acousticness.enabled ? this.state.acousticness.value / 100.0 : undefined,
      this.state.dance.enabled ? this.state.dance.value / 100.0 : undefined,
      this.state.energy.enabled ? this.state.energy.value : undefined,
      this.state.instrumentalness.enabled ? this.state.instrumentalness.value / 100.0 : undefined,
      this.state.popularity.enabled ? this.state.popularity.value : undefined,
      this.state.speechiness.enabled ? this.state.speechiness.value / 100.0 : undefined,
      this.state.happiness.enabled ? this.state.happiness.value / 100.0 : undefined, (err, res) => {
        if (err) {
          console.log(err);
          alert('error fetching data');
          FlowRouter.go(`/blend/${this.props.code}`);
        }
        else {
          this.setState({ moodTracks: res.tracks, loading: false, selecting: true });
        }
      });

  }

  render() {
    if (this.state.loading)
      return (<Loading />);
    else if (this.state.selecting)
      return (
        <div className='custom-mood-container'>
          <h3>Mood results</h3>
          <hr />
          <TrackSelector code={this.props.code} tracks={this.state.moodTracks} />
        </div>
      );
    return (
      <div className='custom-mood-container'>
        <h3>Custom mood</h3>
        <hr />

        <p>Pick between 1 and 5 genres to search songs for</p>

        <Select
          ref={sel => this.sel = sel}
          onChange={(option) => {
            if(option.length <= 5)
              this.setState({ selectedGenres: option})
            else
              this.sel.blur();
          }}
          value={this.state.selectedGenres}          
          isMulti
          isSearchable
          closeMenuOnSelect={false}
          openMenuOnClick={true}
          openMenuOnFocus={true}
          placeholder="Select genres"
          styles={customStyles}
          options={genres}
          className="genre-multi-select"
          classNamePrefix="select"
        />

        <p>Choose and tweak which parameters do you want to query songs for</p>

        <MoodParameter title="Happiness"
          description="How 'positive' the tracks should be"
          enabled={this.state.happiness.enabled}
          onEnable={() => this.onEnableGenerator('happiness')}
          value={this.state.happiness.value}
          onChange={(e) => this.onChangeGenerator(e, 'happiness')}
          minLabel='Sad' maxLabel='Cheerful' />

        <MoodParameter title="Energy"
          description="Speed and loudness of the tracks"
          enabled={this.state.energy.enabled}
          onEnable={() => this.onEnableGenerator('energy')}
          value={this.state.energy.value}
          onChange={(e) => this.onChangeGenerator(e, 'energy')}
          minLabel='Quiet' maxLabel='Energetic' />

        <MoodParameter title="Danceability"
          description="How suitable for dancing should the tracks be"
          enabled={this.state.dance.enabled}
          onEnable={() => this.onEnableGenerator('dance')}
          value={this.state.dance.value}
          onChange={(e) => this.onChangeGenerator(e, 'dance')}
          minLabel='Least danceable' maxLabel='Most Danceable' />

        <MoodParameter title="Acousticness"
          description="How acoustic the tracks should be"
          enabled={this.state.acousticness.enabled}
          onEnable={() => this.onEnableGenerator('acousticness')}
          value={this.state.acousticness.value}
          onChange={(e) => this.onChangeGenerator(e, 'acousticness')}
          minLabel='Not acoustic' maxLabel='Acoustic' />

        <MoodParameter title="Instrumentalness"
          description="The amount of vocal content in the tracks"
          enabled={this.state.instrumentalness.enabled}
          onEnable={() => this.onEnableGenerator('instrumentalness')}
          value={this.state.instrumentalness.value}
          onChange={(e) => this.onChangeGenerator(e, 'instrumentalness')}
          minLabel='Vocal' maxLabel='Instrumental' />

        <MoodParameter title="Popularity"
          description="How trending the tracks should be"
          enabled={this.state.popularity.enabled}
          onEnable={() => this.onEnableGenerator('popularity')}
          value={this.state.popularity.value}
          onChange={(e) => this.onChangeGenerator(e, 'popularity')}
          minLabel='Alternative' maxLabel='Trending' />

        <MoodParameter title="Speechiness"
          description="Presence of spoken words/speech in the tracks"
          enabled={this.state.speechiness.enabled}
          onEnable={() => this.onEnableGenerator('speechiness')}
          value={this.state.speechiness.value}
          onChange={(e) => this.onChangeGenerator(e, 'speechiness')}
          minLabel='Music' maxLabel='Speech' />

        <div className='mood-parameter-buttons'>
          <button className='btn black' onClick={() => FlowRouter.go(`/blend/${this.props.code}/add_tracks`)}>Cancel</button>
          <button className='btn' disabled={this.state.selectedGenres.length === 0} onClick={() => this.moodSearch()}>Search tracks</button>
        </div>
      </div>
    );
  }

}

CustomMood.propTypes = {
  code: PropTypes.string.isRequired
};

export default CustomMood;
