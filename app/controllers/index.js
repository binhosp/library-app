import Ember from 'ember';

export default Ember.Controller.extend({

    headerMessage:'Coming Soon',
    responseMessage:'',
    emailAddress: '',

    actions: {
        
        
        saveInvitation(){
            const email = this.get('emailAddress');

            const newInvitation = this.store.createRecord('invitation',{
                email: email
            });

            newInvitation.save().then((response) =>{
                this.set('responseMessage', `Thank you ! We've just saved your email address: ${this.get('emailAddress')} with id: ${response.get('id')}`);
                this.set('emailAddress','');
            }) ;
        }
    }
})