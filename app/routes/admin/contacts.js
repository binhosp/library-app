import Ember from 'ember';

export default Ember.Route.extend({

  model() {
    return this.store.findAll('contact');
  },

  actions: {
    deleteContact(contact) {
      
      let confimation = confirm('Vai apagar o contato? ');

      if(confimation){
        contact.destroyRecord();
      }
    }
  }
});