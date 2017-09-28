import Ember from 'ember';

export default Ember.Route.extend({

  model() {

    //Ember.RSVP serve para fazer uma chamda de varios modelos, ao mesmo tempo, em uma única rota.
    return Ember.RSVP.hash({
      //RSVP.hash empacota múltiplas promisses e retorna um objeto de hash bem estruturado. 
      books: this.store.findAll('book'),
      authors: this.store.findAll('author'),
      libraries: this.store.findAll('library')
    });
  },

  setupController(controller, model) {

    const books = model.books;

    const authors = model.authors;

    const libraries = model.libraries;

    this._super(controller, books);

    controller.set('authors', authors);

    controller.set('libraries', libraries);

  },

  actions: {

    /**
     *Ações para o objeto book na coluna Autor do template/books.hbs  
    */
    //true para flegar q o autor esta em modo edição
    editAuthor(book) {
      book.set('isAuthorEditEnabled', true);
    },
    //false para cancelar o modo edição e desfazer as alterações no model de autor
    cancelAuthorEdit(book) {
      book.set('isAuthorEditEnabled', false);
      book.rollbackAttributes();
    },

    saveAuthor(author, book) {

      // Removendo a relação do autor com livro
      book.get('author').then((previousAuthor) => {
        previousAuthor.get('books').then((previousAuthorBooks) => {
          previousAuthorBooks.removeObject(book);
          previousAuthor.save();
        });
      });

      // Associação do novo autor no livro
      book.set('author', author);
      book.save().then(() => author.save());
      book.set('isAuthorEditing', false);
    },

    /**
     *Ações para o objeto book na coluna titulo do template/books.hbs 
     */
    //true para flegar q o livro esta em modo edição
    editBook(book) {
      book.set('isBookEditEnabled', true);
    },
    //false para cancelar o modo edição e desfazer as alterações no model livro
    cancelBookEdit(book) {
      book.set('isBookEditEnabled', false);
      book.rollbackAttributes();
    },

    saveBook(book) {
      if (book.get('isNotValid')) {
        return;
      }

      book.set('isBookEditEnabled', false);
      book.save();
    },

    /**
     * Ações para o objeto book na coluna biblioteca do template/books.hbs  
    */
     //true para flegar q o autor esta em modo edição
    editLibrary(book) {
      book.set('isLibraryEditing', true);
    },

     //false para cancelar o modo edição e desfazer as alterações no model biblioteca
    cancelLibraryEdit(book) {
      book.set('isLibraryEditing', false);
      book.rollbackAttributes();
    },

    saveLibrary(library, book) {
      // Removendo a relação do biblioteca com livro
      book.get('library').then((previousLibrary) => {
        previousLibrary.get('books').then((previousLibraryBooks) => {
          previousLibraryBooks.removeObject(book);
          previousLibrary.save();
        });
      });

      book.set('library', library);
      book.save().then(() => library.save());
      book.set('isLibraryEditing', false);
    }
  }
});