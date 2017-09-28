// app/controllers/admin/seeder.js
import Ember from 'ember';
import Faker from 'faker';

export default Ember.Controller.extend({


  actions: {

    generateLibraries(volume) {

      //console.log('qntde de libraries para gerar : ' + volume);

      // true para mostar a icone spinner.
      this.set('generateLibrariesInProgress', true);

      const counter = parseInt(volume);

      let savedLibraries = [];
      for (let i = 0; i < counter; i++) {

        // cria e adiciona no array um library gerado
        savedLibraries.push(this._saveRandomLibrary());
      }

      // Espera o promisse terminar para desligar o spinner e mostrar o fader-label.
      Ember.RSVP.all(savedLibraries)
        .then(() => {
          this.set('generateLibrariesInProgress', false);
          this.set('libDone', true)
        });
    },

    deleteLibraries() {

      // true para mostar a icone spinner qndo deletar
      this.set('deleteLibrariesInProgress', true);

      // O _destroyAll retorna uma promisse e mudamos o label quandos todas as linha forem removidas.
      this._destroyAll(this.get('libraries'))

        // A remoção feita através do seeder-block para o fader-label para poder mostar no label.
        // Mudar o indicador de progresso e deslicar o spinner.
        .then(() => {
          this.set('libDelDone', true);
          this.set('deleteLibrariesInProgress', false);
        });
    },

    generateBooksAndAuthors(volume) {

      // true para mostar a icone spinner.
      this.set('generateBooksInProgress', true);

      const counter = parseInt(volume);
      let booksWithAuthors = [];

      for (let i = 0; i < counter; i++) {

        // cria e adiciona no array um book gerado.
        const books = this._saveRandomAuthor().then(newAuthor => this._generateSomeBooks(newAuthor));
        booksWithAuthors.push(books);
      }

      // Espera que o save assincrono termine para assim deligar o spinner e mostrar o fader-label.
      Ember.RSVP.all(booksWithAuthors)

        // A remoção feita através do seeder-block para o fader-label para poder mostar no label.
        // Mudar o indicador de progresso e deslicar o spinner.
        .then(() => {
          this.set('authDone', true);
          this.set('generateBooksInProgress', false);
        });
    },

    deleteBooksAndAuthors() {

       // true para mostar a icone spinner.
      this.set('deleteBooksInProgress', true);

      const authors = this.get('authors');
      const books = this.get('books');

      // Remove primeira os autores e os livros depois, e no final mostra o label.
      this._destroyAll(authors)
        .then(() => this._destroyAll(books))

        // A remoção feita através do seeder-block para o fader-label para poder mostar no label.
        // Mudar o indicador de progresso e deslicar o spinner.
        .then(() => {
          this.set('authDelDone', true);
          this.set('deleteBooksInProgress', false);
        });
    }
  },

  //Metodos privados
  // Cria uma record de library record usando o randomizador do faker que ira colocar dados fake no model
  // Depois disso salva e retorna uma promisse
  _saveRandomLibrary() {
    return this.store.createRecord('library').randomize().save();
  },

  _saveRandomAuthor() {
    return this.store.createRecord('author').randomize().save();
  },

  _generateSomeBooks(author) {
    const bookCounter = Faker.random.number(10);
    let books = [];

    for (let j = 0; j < bookCounter; j++) {
      const library = this._selectRandomLibrary();

      // Cria e salva um book, salvando as record relacionadas. isso leva um tempo pois todos são promisses.
      const bookPromise =
        this.store.createRecord('book')
          .randomize(author, library)
          .save()
          .then(() => author.save())

          // Guarda um Library caso não tenha nenhuma
          .then(() => library && library.save());
      books.push(bookPromise)
    }

    // Retorna um a promisse para que possamos gerenciat o tempo de processamento
    return Ember.RSVP.all(books);
  },

  _selectRandomLibrary() {

    // As Libraries são records da store, ou seja, é um DS.RecordArray

    // Please note libraries are records from store, which means this is a DS.RecordArray object, it is extended from
    // Ember.ArrayProxy. If you need an element from this list, you cannot just use libraries[3], we have to use
    // libraries.objectAt(3)

    /**
     * Como as Libraries Ember.ArrayProxy
     */
    const libraries = this.get('libraries');
    const size = libraries.get('length');

    // Get a random number between 0 and size-1
    const randomItem = Faker.random.number(size - 1);
    return libraries.objectAt(randomItem);
  },

  _destroyAll(records) {

    // destroyRecord() is a Promise and will be fulfilled when the backend database is confirmed the delete
    // lets collect these Promises in an array
    const recordsAreDestroying = records.map(item => item.destroyRecord());

    // Wrap all Promise in one common Promise, RSVP.all is our best friend in this process. ;)
    return Ember.RSVP.all(recordsAreDestroying);
  }
});