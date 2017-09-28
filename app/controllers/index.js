import Ember from 'ember';

export default Ember.Controller.extend({

    headerMessage:'Em breve',
    responseMessage:'',
    emailAddress: '',

    //serao usado para validar a tela de convite index.hbs
    isValid: Ember.computed.match('emailAddress', /^.+@.+\..+$/),
    isDisabled: Ember.computed.not('isValid'),  

    actions: {
    
        saveInvitation(){
            
            const email = this.get('emailAddress');

            /**
             * Criando um objeto invitation no controler ao executar o saveInvitation()
             */
            const newInvitation = this.store.createRecord('invitation',{
                email: email
            });

            /**
             * Caso o response esteja ok ao salvar...
             */
            newInvitation.save().then((response) =>{
                //defino um mensagem em responseMessage e 
                this.set('responseMessage', `Obrigado! Salvamos seu endereço de e-mail: ${this.get('emailAddress')} com id : ${response.get('id')}`);
                //limpo o campo de e-mail vinculado no index.hbs 
                this.set('emailAddress','');
            }) ;
        }
    }
})