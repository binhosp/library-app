import DS from 'ember-data';
import Ember from 'ember'

export default DS.Model.extend({
  
  /**
   *Atributos do modelo 
   */
  email: DS.attr('string'),
  message: DS.attr('string'),


  /**
   * Validações foram transferidas do controller deletado para o model contact.js
   */
  isValidEmail: Ember.computed.match('email', /^.+@.+\..+$/),
  hasEnoughText: Ember.computed.gte('message.length', 5),

  isValid: Ember.computed.and('isValidEmail', 'hasEnoughText'),
  isNotValid: Ember.computed.not('isValid')

});
