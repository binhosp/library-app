import Ember from 'ember';

export default Ember.Route.extend({


    model() {
        return this.store.createRecord('contact');
    },
    actions: {

        sendEmail(newContactMessage) {

           
            //newContactMessage.save().then(() => this.controller.set('responseMessage', true));
            newContactMessage.save().then(() => this.controller.set('responseSendEmail', true));

            /*
            var email = this.get('email');
            var message = this.get('message');

            alert('Sending your message in progress... ');

            var responseMessage = 'To: ' + email + ', Message: ' + message;
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
