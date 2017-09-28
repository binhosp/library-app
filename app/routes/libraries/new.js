import Ember from 'ember';

export default Ember.Route.extend({

    model() {
        return this.store.createRecord('library');
    },

    setupController :  function(controller, model){
        
        this._super(controller, model);//herança

        controller.set('title', 'Nova Biblioteca');
        controller.set('buttonLabel', 'Novo');
    },

    renderTemplate(){
        this.render('libraries/form');
    },

    actions: {
        
        saveLibrary(newLibrary) {
           
            newLibrary.save().then(() => this.transitionTo('libraries'));
            
        },       

        //Isso é um evento
        willTransition() {
            //rollbackAttributes() remove a record da store se a mesma for nova. 'isNew'

            //this.controller conseguimos acessar o controller virtual pois ele não foi criado. o Ember faz isso 
            let model = this.controller.get('model');

            if (model.get('isNew')) {
                model.destroyRecord();
            }
        }
    }
});
