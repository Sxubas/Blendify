import React from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import './CreateBlend.css';

class CreateBlend extends React.Component {

  sumbitBlend(event){
    event.preventDefault();
    const name = this.nameInput.value;
    const desc = this.descInput.value;

    //Call corrected submit method
    Meteor.call('users.createPlaylist', name, desc, (err, res) => {
      if(err) {
        alert(err);
        return;
      }
      Meteor.call('rooms.create', res, (err, res) => {
        if(err) {
          alert(err);
          return;
        }
        console.log(res);
        FlowRouter.go(`/blend/${res}`);
      });
    });
  }

  render() {
    return (
      <div className='create-container'>
        <h3>
          Create blend
        </h3>
        <hr/>
        <form onSubmit={(e) => this.sumbitBlend(e)} role='form'>
          <label>
            Nombre
            <input type="text" maxLength="100" ref={ref => this.nameInput = ref} />
          </label>

          <label>
            Description
            <textarea className='create-description' maxLength="300" ref={ref => this.descInput = ref} />
          </label>
          <div>
            <button className='btn' type="submit">Create</button>            
            <button className='btn black' onClick={() => FlowRouter.go('home')}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

CreateBlend.propTypes = {

};

export default CreateBlend;
