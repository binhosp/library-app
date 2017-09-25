// app\routes\admin\seeder.js
import Ember from 'ember';

export default Ember.Route.extend({

    model(){
    
        //RSVP serve para fazer uma chamada e retornar vários objetos de uma vez
        return Ember.RSVP.hash({

            libraries: this.store.findAll('library'),
            books: this.store.findAll('book'),
            authors: this.store.findAll('author')
        
        })
    },

    setupController(controller, model){
        controller.set('libraries',model.libraries);
        controller.set('books',model.books);        
        controller.set('authors',model.authors);        
        
        this._super(controller, model);

    }

    
      // You can use these lines to experiment with route hooks.
      // Uncomment these and comment out the real implementation below.
      // Open inspection console in your browser and check how Ember call
      // each hook automatically.
      //
      //init() {
      //  debugger;
      //},
      //
      //beforeModel() {
      //  debugger;
      //},
      //
      //model() {
      //  debugger;
      //},
      //
      //afterModel() {
      //  debugger;
      //},
      //
      //setupController() {
      //  debugger;
      //},
      //
      //renderTemplate() {
      //  debugger;
      //},
      //
      //activate() {
      //  debugger;
      //}
    
     
});
