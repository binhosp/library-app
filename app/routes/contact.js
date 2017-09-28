import Ember from 'ember';

export default Ember.Route.extend({


    model() {
        return this.store.createRecord('contact');
    },
    
    actions: {

        sendEmail(newContactMessage) {

           newContactMessage.save().then(() => this.controller.set('responseSendEmail', true));

            /*
            var email = this.get('email');
            var message = this.get('message');

            alert('Enviando sua mensagem... ');

            var responseMessage = 'Para: ' + email + ', Mensagem: ' + message;
            this.set('responseSendEmail', responseMessage);
            this.set('email', '');
            this.set('message', '');
            */
        },

        willTransition() {
            
            let model = this.controller.get('model');

            if (model.get('isNew')) {
                model.destroyRecord();
            }

            this.controller.set('responseSendEmail', false);
        }
    }

});
