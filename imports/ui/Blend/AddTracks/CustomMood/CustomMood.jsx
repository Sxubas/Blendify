import React from 'react';
import PropTypes from 'prop-types';

import MoodParameter from './MoodParameter/MoodParameter.jsx';

import './CustomMood.css';
import './CustomMood.mobile.css';
import Loading from '../../../Loading/Loading.jsx';
import TrackSelector from '../TrackSelector/TrackSelector.jsx';

class CustomMood extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      selecting: false,
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
    this.onChangeGenerator.bind(this);
  }

  onEnableGenerator(parameter) {
    return () => {
      const param = this.state[parameter];
      param.enabled = !param.enabled;
      const update = {};
      update[parameter] = param;
      this.setState(update);
    };
  }

  onChangeGenerator(parameter) {
    return event => {
      const param = this.state[parameter];
      param.value = parseInt(event.target.value);
      const update = {};
      update[parameter] = param;
      this.setState(update);
    };
  }

  moodSearch(){
    this.setState({loading: true});
    //TODO Call meteor method and update result
    this.setState({moodTracks: [], loading: false});
  }

  render() {

    if(this.state.loading)
      return(<Loading />);
    else if(this.state.selecting)
      return(<TrackSelector code={this.props.code} tracks={this.state.moodTracks}/>);
    
    return (
      <div className='custom-mood-container'>
        <h3>Custom mood</h3>
        <hr />
        <p>Choose and tweak which parameters do you want to query songs for</p>

        <MoodParameter title="Happiness"
          description="How 'positive' the tracks should be"
          enabled={this.state.happiness.enabled}
          onEnable={this.onEnableGenerator('happiness')}
          value={this.state.happiness.value}
          onChange={this.onChangeGenerator('happiness')}
          minLabel='Sad' maxLabel='Cheerful' />

        <MoodParameter title="Energy"
          description="Speed and loudness of the tracks"
          enabled={this.state.energy.enabled}
          onEnable={this.onEnableGenerator('energy')}
          value={this.state.energy.value}
          onChange={this.onChangeGenerator('energy')}
          minLabel='Quiet' maxLabel='Energetic' />

        <MoodParameter title="Acousticness"
          description="How acoustic the tracks should be"
          enabled={this.state.acousticness.enabled}
          onEnable={this.onEnableGenerator('acousticness')}
          value={this.state.acousticness.value}
          onChange={this.onChangeGenerator('acousticness')}
          minLabel='Not acoustic' maxLabel='Acoustic' />

        <MoodParameter title="Instrumentalness"
          description="The amount of vocal content in the tracks"
          enabled={this.state.instrumentalness.enabled}
          onEnable={this.onEnableGenerator('instrumentalness')}
          value={this.state.instrumentalness.value}
          onChange={this.onChangeGenerator('instrumentalness')}
          minLabel='Vocal' maxLabel='Instrumental' />

        <MoodParameter title="Popularity"
          description="How trending the tracks should be"
          enabled={this.state.popularity.enabled}
          onEnable={this.onEnableGenerator('popularity')}
          value={this.state.popularity.value}
          onChange={this.onChangeGenerator('popularity')}
          minLabel='Alternative' maxLabel='Trending' />

        <MoodParameter title="Speechiness"
          description="Presence of spoken words/speech in the tracks"
          enabled={this.state.speechiness.enabled}
          onEnable={this.onEnableGenerator('speechiness')}
          value={this.state.speechiness.value}
          onChange={this.onChangeGenerator('speechiness')}
          minLabel='Music' maxLabel='Speech' />
      
        <div className='mood-parameter-buttons'>
          <button className='btn black'>Cancel</button>
          <button className='btn'>Search tracks</button>
        </div>
      </div>
    );
  }

}

CustomMood.propTypes = {
  code: PropTypes.string.isRequired
};

export default CustomMood;
