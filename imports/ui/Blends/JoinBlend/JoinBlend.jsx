import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import './JoinBlend.css';

class JoinBlend extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      code: ''
    };
  }

  invalidCode() {
    const re = /([A-Z])([A-Z])([0-9])([0-9])([0-9])/gi;
    return !re.test(this.state.code);
  }

  submitJoin(event) {
    event.preventDefault();

    Meteor.call('rooms.addContributor', this.state.code, (err, res) => {
      if (err) {
        alert(err);
        return;
      }
      FlowRouter.go(`/blend/${this.state.code}`);
    });
  }

  render() {
    return (
      <div className='join-container'>
        <h3>
          Join blend
        </h3>
        <hr />
        <form onSubmit={(e) => this.submitJoin(e)} role='form'>
          <input
            type="text"
            placeholder="TS443"
            maxLength={5}
            onChange={event => this.setState({ code: event.target.value })}
            value={this.state.code}
          />
          {this.invalidCode() && <p role='alert'>The code should have the format: XX999</p>}
          <div>
            <button aria-label="Join Blend" className='btn' type="submit" disabled={this.invalidCode()}>Join blend</button>
            <button aria-label="Cancel" className='btn black' onClick={() => window.history.back()}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

JoinBlend.propTypes = {

};

export default JoinBlend;
