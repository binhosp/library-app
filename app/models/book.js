import DS from 'ember-data';

//importando o gerador de dados
import Faker from 'faker';

export default DS.Model.extend({

  title: DS.attr('string'),
  releaseYear: DS.attr('date'),

  author: DS.belongsTo('author', {inverse: 'books', async: true}),
  library: DS.belongsTo('library', {inverse: 'books', async: true}),

  randomize(author, library) {
    Faker.locale ='pt_BR';
    Faker.localeFallback ='pt_BR';
    
    this.set('title', this._bookTitle());
    console.log(this.get('title'));
    this.set('author', author);
    this.set('releaseYear', this._randomYear());
    this.set('library', library);

    return this;
  },
   
  _bookTitle() {
    return `${Faker.commerce.productName()} Cookbook`;
  },

  _randomYear() {
    return new Date(this._getRandomArbitrary(1900, 2015).toPrecision(4));
  },

  _getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
});