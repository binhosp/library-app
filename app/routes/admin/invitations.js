import Ember from 'ember';

/**
 * As Routas são responsaveis por fazer a busca dos dados na API.
 */
export default Ember.Route.extend({
    model(){
        
        //a string do findAll é o nome do model invitation
        return this.store.findAll('invitation');
    }
});
