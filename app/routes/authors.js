// app/routes/authors.js
import Ember from 'ember';
export default Ember.Route.extend({

  model() {
    return this.store.findAll('author');
  },

  actions: {

    //true para ativar o modo edição
    editAuthor(author) {
      author.set('editEnable', true);
    },

    //false para canceler e desfazer as alterações que o model author sofreu
    cancelAuthorEdit(author) {
      author.set('editEnable', false);
      author.rollbackAttributes();
    },

    //salvando a alterção
    saveAuthor(author) {

      if (author.get('isNotValid')) {
        return;
      } 

      author.set('editEnable', false);
      author.save();
    }
  }
});