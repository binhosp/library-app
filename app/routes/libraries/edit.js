import Ember from 'ember';

export default Ember.Route.extend({

    //A funcao model recebe o param retornando um model do tipo library e esta recebendo um parametro
    model(params){
        //debugger;
        //O valor params.library_id veio do router.js
        //Irá buscar no banco de dados um library com o id passado
        return this.store.findRecord('library',params.library_id);
    },

    setupController :  function(controller, model){
        
        this._super(controller, model);//herança

        controller.set('title', 'Editar biblioteca');
        controller.set('buttonLabel', 'Salvar');
    },

    renderTemplate(){
        this.render('libraries/form');
    },

    actions : {

        //ação para salvar um objeto library
        saveLibrary(library){
            //assim que salvar redirecione para libraries.hbs
            library.save().then(() => this.transitionTo('libraries'));
        },

        //Evendo roda caso o usuario deixe a pagina
        willTransition(transition){

            let model = this.controller.get('model');

            //se alguma propriedade foi alterada
            if(model.get('hasDirtyAttributes')){
                
                //debugger;

                //pergunta oq o usuario quer fazer quer deixar a pagina.
                let confirmation = confirm( "Your changes haven't saved yet. Would you like to leave this form?")

                if(confirmation){
                    //se sim faz o rolback nas alterações do model
                    model.rollbackAttributes();
                }else{
                    //caso continue na pagina
                    transition.abort();
                }
            }
        }
    }
});
