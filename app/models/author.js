// app/models/author.js
import DS from 'ember-data';
import Ember from 'ember';

//importando o gerador de dados
import Faker from 'faker';

export default DS.Model.extend({

  name: DS.attr('string'),
  books: DS.hasMany('book', {inverse: 'author'}),

  isNotValid: Ember.computed.empty('name'),

  randomize() {
    Faker.locale ='pt_BR';
    Faker.localeFallback ='pt_BR';
    this.set('name', Faker.name.findName());
    //console.log(this.get('name'));
    return this;
  } 
});