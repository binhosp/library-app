"use strict";



define('library-app/adapters/application', ['exports', 'emberfire/adapters/firebase'], function (exports, _firebase) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _firebase.default.extend({});
});
define('library-app/app', ['exports', 'library-app/resolver', 'ember-load-initializers', 'library-app/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('library-app/components/author-select', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({

        tagName: 'select',
        classNames: ['form-control'],
        authors: [],
        book: null,

        change: function change(event) {

            var selectedAuthorId = event.target.value;

            var selectedAuthor = this.get('authors').find(function (record) {
                return record.id === selectedAuthorId;
            });

            this.sendAction('action', selectedAuthor, this.get('book'));
        }
    });
});
define('library-app/components/fader-label', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({
    tagName: 'span',

    classNames: ['label label-success label-fade'],
    classNameBindings: ['isShowing:label-show'],

    isShowing: false,

    isShowingChanged: Ember.observer('isShowing', function () {
      var _this = this;

      // User can navigate away from this page in less than 3 seconds, so this component will be destroyed,
      // however our "setTimeout" task try to run.
      // We save this task in a local variable, so it can be cleaned up during the destroy process.
      // Otherwise you will see a "calling set on destroyed object" error.
      this._runLater = Ember.run.later(function () {
        return _this.set('isShowing', false);
      }, 3000);
    }),

    resetRunLater: function resetRunLater() {
      this.set('isShowing', false);
      Ember.run.cancel(this._runLater);
    },
    willDestroy: function willDestroy() {
      this.resetRunLater();
      this._super.apply(this, arguments);
    }
  });
});
define('library-app/components/library-item-form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({

    buttonLabel: 'Save',

    actions: {
      buttonClicked: function buttonClicked(param) {

        this.sendAction('action', param);
      }
    }

  });
});
define('library-app/components/library-item', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({});
});
define('library-app/components/library-select', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Component.extend({

        tagName: 'select',
        classNames: ['form-control'],
        libraries: [],
        book: null,

        change: function change(event) {

            var selectedLibraryId = event.target.value;

            var selectedLibrary = this.get('libraries').find(function (record) {
                return record.id === selectedLibraryId;
            });

            this.sendAction('action', selectedLibrary, this.get('book'));
        }
    });
});
define('library-app/components/nav-link-to', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.LinkComponent.extend({

    tagName: 'li'
  });
});
define('library-app/components/number-box', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Component.extend({});
});
define('library-app/components/seeder-block', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var MAX_VALUE = 100;

  exports.default = Ember.Component.extend({

    counter: null,

    isCounterValid: Ember.computed.lte('counter', MAX_VALUE),
    isCounterNotValid: Ember.computed.not('isCounterValid'),
    placeholder: 'Max ' + MAX_VALUE,

    generateReady: false,
    deleteReady: false,

    generateInProgress: false,
    deleteInProgress: false,

    generateIsDisabled: Ember.computed.or('isCounterNotValid', 'generateInProgress', 'deleteInProgress'),
    deleteIsDisabled: Ember.computed.or('generateInProgress', 'deleteInProgress'),

    actions: {
      generateAction: function generateAction() {
        if (this.get('isCounterValid')) {

          // Action up to Seeder Controller with the requested amount
          this.sendAction('generateAction', this.get('counter'));
        }
      },
      deleteAction: function deleteAction() {
        this.sendAction('deleteAction');
      }
    }
  });
});
define('library-app/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('library-app/controllers/admin/seeder', ['exports', 'faker'], function (exports, _faker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Controller.extend({

    actions: {
      generateLibraries: function generateLibraries(volume) {
        var _this = this;

        //console.log('qntde de libraries para gerar : ' + volume);

        // true para mostar a icone spinner.
        this.set('generateLibrariesInProgress', true);

        var counter = parseInt(volume);

        var savedLibraries = [];
        for (var i = 0; i < counter; i++) {

          // cria e adiciona no array um library gerado
          savedLibraries.push(this._saveRandomLibrary());
        }

        // Espera o promisse terminar para desligar o spinner e mostrar o fader-label.
        Ember.RSVP.all(savedLibraries).then(function () {
          _this.set('generateLibrariesInProgress', false);
          _this.set('libDone', true);
        });
      },
      deleteLibraries: function deleteLibraries() {
        var _this2 = this;

        // true para mostar a icone spinner qndo deletar
        this.set('deleteLibrariesInProgress', true);

        // O _destroyAll retorna uma promisse e mudamos o label quandos todas as linha forem removidas.
        this._destroyAll(this.get('libraries'))

        // A remoção feita através do seeder-block para o fader-label para poder mostar no label.
        // Mudar o indicador de progresso e deslicar o spinner.
        .then(function () {
          _this2.set('libDelDone', true);
          _this2.set('deleteLibrariesInProgress', false);
        });
      },
      generateBooksAndAuthors: function generateBooksAndAuthors(volume) {
        var _this3 = this;

        // true para mostar a icone spinner.
        this.set('generateBooksInProgress', true);

        var counter = parseInt(volume);
        var booksWithAuthors = [];

        for (var i = 0; i < counter; i++) {

          // cria e adiciona no array um book gerado.
          var books = this._saveRandomAuthor().then(function (newAuthor) {
            return _this3._generateSomeBooks(newAuthor);
          });
          booksWithAuthors.push(books);
        }

        // Espera que o save assincrono termine para assim deligar o spinner e mostrar o fader-label.
        Ember.RSVP.all(booksWithAuthors)

        // A remoção feita através do seeder-block para o fader-label para poder mostar no label.
        // Mudar o indicador de progresso e deslicar o spinner.
        .then(function () {
          _this3.set('authDone', true);
          _this3.set('generateBooksInProgress', false);
        });
      },
      deleteBooksAndAuthors: function deleteBooksAndAuthors() {
        var _this4 = this;

        // true para mostar a icone spinner.
        this.set('deleteBooksInProgress', true);

        var authors = this.get('authors');
        var books = this.get('books');

        // Remove primeira os autores e os livros depois, e no final mostra o label.
        this._destroyAll(authors).then(function () {
          return _this4._destroyAll(books);
        })

        // A remoção feita através do seeder-block para o fader-label para poder mostar no label.
        // Mudar o indicador de progresso e deslicar o spinner.
        .then(function () {
          _this4.set('authDelDone', true);
          _this4.set('deleteBooksInProgress', false);
        });
      }
    },

    //Metodos privados
    // Cria uma record de library record usando o randomizador do faker que ira colocar dados fake no model
    // Depois disso salva e retorna uma promisse
    _saveRandomLibrary: function _saveRandomLibrary() {
      return this.store.createRecord('library').randomize().save();
    },
    _saveRandomAuthor: function _saveRandomAuthor() {
      return this.store.createRecord('author').randomize().save();
    },
    _generateSomeBooks: function _generateSomeBooks(author) {
      var _this5 = this;

      var bookCounter = _faker.default.random.number(10);
      var books = [];

      var _loop = function _loop(j) {
        var library = _this5._selectRandomLibrary();

        // Cria e salva um book, salvando as record relacionadas. isso leva um tempo pois todos são promisses.
        var bookPromise = _this5.store.createRecord('book').randomize(author, library).save().then(function () {
          return author.save();
        })

        // Guarda um Library caso não tenha nenhuma
        .then(function () {
          return library && library.save();
        });
        books.push(bookPromise);
      };

      for (var j = 0; j < bookCounter; j++) {
        _loop(j);
      }

      // Retorna um a promisse para que possamos gerenciat o tempo de processamento
      return Ember.RSVP.all(books);
    },
    _selectRandomLibrary: function _selectRandomLibrary() {

      // As Libraries são records da store, ou seja, é um DS.RecordArray

      // Please note libraries are records from store, which means this is a DS.RecordArray object, it is extended from
      // Ember.ArrayProxy. If you need an element from this list, you cannot just use libraries[3], we have to use
      // libraries.objectAt(3)

      /**
       * Como as Libraries Ember.ArrayProxy
       */
      var libraries = this.get('libraries');
      var size = libraries.get('length');

      // Get a random number between 0 and size-1
      var randomItem = _faker.default.random.number(size - 1);
      return libraries.objectAt(randomItem);
    },
    _destroyAll: function _destroyAll(records) {

      // destroyRecord() is a Promise and will be fulfilled when the backend database is confirmed the delete
      // lets collect these Promises in an array
      var recordsAreDestroying = records.map(function (item) {
        return item.destroyRecord();
      });

      // Wrap all Promise in one common Promise, RSVP.all is our best friend in this process. ;)
      return Ember.RSVP.all(recordsAreDestroying);
    }
  });
});
define('library-app/controllers/index', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Controller.extend({

        headerMessage: 'Em breve',
        responseMessage: '',
        emailAddress: '',

        //serao usado para validar a tela de convite index.hbs
        isValid: Ember.computed.match('emailAddress', /^.+@.+\..+$/),
        isDisabled: Ember.computed.not('isValid'),

        actions: {
            saveInvitation: function saveInvitation() {
                var _this = this;

                var email = this.get('emailAddress');

                /**
                 * Criando um objeto invitation no controler ao executar o saveInvitation()
                 */
                var newInvitation = this.store.createRecord('invitation', {
                    email: email
                });

                /**
                 * Caso o response esteja ok ao salvar...
                 */
                newInvitation.save().then(function (response) {
                    //defino um mensagem em responseMessage e 
                    _this.set('responseMessage', 'Obrigado! Salvamos seu endere\xE7o de e-mail: ' + _this.get('emailAddress') + ' com id : ' + response.get('id'));
                    //limpo o campo de e-mail vinculado no index.hbs 
                    _this.set('emailAddress', '');
                });
            }
        }
    });
});
define('library-app/helpers/app-version', ['exports', 'library-app/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  var version = _environment.default.APP.version;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (hash.hideSha) {
      return version.match(_regexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_regexp.shaRegExp)[0];
    }

    return version;
  }

  exports.default = Ember.Helper.helper(appVersion);
});
define('library-app/helpers/is-equal', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.isEqual = isEqual;
  function isEqual(params /*, hash*/) {

    return params[0] === params[1];
  }

  exports.default = Ember.Helper.helper(isEqual);
});
define('library-app/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('library-app/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('library-app/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'library-app/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _config$APP = _environment.default.APP,
      name = _config$APP.name,
      version = _config$APP.version;
  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('library-app/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('library-app/initializers/data-adapter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('library-app/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('library-app/initializers/ember-faker', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() /* container, application */{
    // application.inject('route', 'foo', 'service:foo');
  };

  exports.default = {
    name: 'ember-faker',
    initialize: initialize
  };
});
define('library-app/initializers/emberfire', ['exports', 'emberfire/initializers/emberfire'], function (exports, _emberfire) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberfire.default;
});
define('library-app/initializers/export-application-global', ['exports', 'library-app/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('library-app/initializers/injectStore', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('library-app/initializers/store', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('library-app/initializers/transforms', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("library-app/instance-initializers/ember-data", ["exports", "ember-data/instance-initializers/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('library-app/models/author', ['exports', 'ember-data', 'faker'], function (exports, _emberData, _faker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({

    name: _emberData.default.attr('string'),
    books: _emberData.default.hasMany('book', { inverse: 'author' }),

    isNotValid: Ember.computed.empty('name'),

    randomize: function randomize() {
      _faker.default.locale = 'pt_BR';
      _faker.default.localeFallback = 'pt_BR';
      this.set('name', _faker.default.name.findName());
      //console.log(this.get('name'));
      return this;
    }
  });
});
define('library-app/models/book', ['exports', 'ember-data', 'faker'], function (exports, _emberData, _faker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({

    title: _emberData.default.attr('string'),
    releaseYear: _emberData.default.attr('date'),

    author: _emberData.default.belongsTo('author', { inverse: 'books', async: true }),
    library: _emberData.default.belongsTo('library', { inverse: 'books', async: true }),

    randomize: function randomize(author, library) {
      _faker.default.locale = 'pt_BR';
      _faker.default.localeFallback = 'pt_BR';

      this.set('title', this._bookTitle());
      //console.log(this.get('title'));
      this.set('author', author);
      this.set('releaseYear', this._randomYear());
      this.set('library', library);

      return this;
    },
    _bookTitle: function _bookTitle() {
      return _faker.default.commerce.productName() + ' Cookbook';
    },
    _randomYear: function _randomYear() {
      return new Date(this._getRandomArbitrary(1900, 2015).toPrecision(4));
    },
    _getRandomArbitrary: function _getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }
  });
});
define('library-app/models/contact', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({

    /**
     *Atributos do modelo 
     */
    email: _emberData.default.attr('string'),
    message: _emberData.default.attr('string'),

    /**
     * Validações foram transferidas do controller deletado para o model contact.js
     */
    isValidEmail: Ember.computed.match('email', /^.+@.+\..+$/),
    hasEnoughText: Ember.computed.gte('message.length', 5),

    isValid: Ember.computed.and('isValidEmail', 'hasEnoughText'),
    isNotValid: Ember.computed.not('isValid')

  });
});
define('library-app/models/invitation', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    email: _emberData.default.attr('string')
  });
});
define('library-app/models/library', ['exports', 'ember-data', 'faker'], function (exports, _emberData, _faker) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    name: _emberData.default.attr('string'),
    address: _emberData.default.attr('string'),
    phone: _emberData.default.attr('string'),

    books: _emberData.default.hasMany('book', { inverse: 'library', async: true }),

    isValid: Ember.computed.notEmpty('name'),

    //abaixo o codigo serve para gerar dados fakes desse modelo
    randomize: function randomize() {
      _faker.default.locale = 'pt_BR';
      _faker.default.localeFallback = 'pt_BR';
      this.set('name', _faker.default.company.companyName() + ' Library');
      this.set('address', this._fullAddress());
      this.set('phone', _faker.default.phone.phoneNumber());

      // If you would like to use in chain.
      return this;
    },
    _fullAddress: function _fullAddress() {
      return _faker.default.address.streetAddress() + ', ' + _faker.default.address.city();
    }
  });
});
define('library-app/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('library-app/router', ['exports', 'library-app/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('about');
    this.route('contact');

    this.route('admin', function () {
      this.route('invitations');
      this.route('contacts');
      this.route('seeder');
    });

    //Exemplo de rotas aninhadas
    //criando na mão sem ember-cli 
    this.route('libraries', function () {
      this.route('new');
      this.route('edit', { path: '/:library_id/edit' });
    });
    this.route('authors');
    this.route('books');
  });

  exports.default = Router;
});
define('library-app/routes/about', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({});
});
define('library-app/routes/admin/contacts', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model() {
      return this.store.findAll('contact');
    },


    actions: {
      deleteContact: function deleteContact(contact) {

        var confimation = confirm('Vai apagar o contato? ');

        if (confimation) {
          contact.destroyRecord();
        }
      }
    }
  });
});
define('library-app/routes/admin/invitations', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        model: function model() {

            //a string do findAll é o nome do model invitation
            return this.store.findAll('invitation');
        },


        actions: {
            deleteInvitation: function deleteInvitation(invitation) {

                var confirmation = confirm('Deseja deletar a Invitation?');

                if (confirmation) {
                    invitation.destroyRecord();
                }
            }
        }
    });
});
define('library-app/routes/admin/seeder', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        model: function model() {

            //RSVP serve para fazer uma chamada e retornar vários objetos de uma vez
            return Ember.RSVP.hash({

                libraries: this.store.findAll('library'),
                books: this.store.findAll('book'),
                authors: this.store.findAll('author')

            });
        },
        setupController: function setupController(controller, model) {
            controller.set('libraries', model.libraries);
            controller.set('books', model.books);
            controller.set('authors', model.authors);

            this._super(controller, model);
        }

        // You can use these lines to experiment with route hooks.
        // Uncomment these and comment out the real implementation below.
        // Open inspection console in your browser and check how Ember call
        // each hook automatically.
        //
        //init() {
        //  debugger;
        //},
        //
        //beforeModel() {
        //  debugger;
        //},
        //
        //model() {
        //  debugger;
        //},
        //
        //afterModel() {
        //  debugger;
        //},
        //
        //setupController() {
        //  debugger;
        //},
        //
        //renderTemplate() {
        //  debugger;
        //},
        //
        //activate() {
        //  debugger;
        //}


    });
});
define('library-app/routes/authors', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model() {
      return this.store.findAll('author');
    },


    actions: {

      //true para ativar o modo edição
      editAuthor: function editAuthor(author) {
        author.set('editEnable', true);
      },


      //false para canceler e desfazer as alterações que o model author sofreu
      cancelAuthorEdit: function cancelAuthorEdit(author) {
        author.set('editEnable', false);
        author.rollbackAttributes();
      },


      //salvando a alterção
      saveAuthor: function saveAuthor(author) {

        if (author.get('isNotValid')) {
          return;
        }

        author.set('editEnable', false);
        author.save();
      }
    }
  });
});
define('library-app/routes/books', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function model() {

      //Ember.RSVP serve para fazer uma chamda de varios modelos, ao mesmo tempo, em uma única rota.
      return Ember.RSVP.hash({
        //RSVP.hash empacota múltiplas promisses e retorna um objeto de hash bem estruturado. 
        books: this.store.findAll('book'),
        authors: this.store.findAll('author'),
        libraries: this.store.findAll('library')
      });
    },
    setupController: function setupController(controller, model) {

      var books = model.books;

      var authors = model.authors;

      var libraries = model.libraries;

      this._super(controller, books);

      controller.set('authors', authors);

      controller.set('libraries', libraries);
    },


    actions: {

      /**
       *Ações para o objeto book na coluna Autor do template/books.hbs  
      */
      //true para flegar q o autor esta em modo edição
      editAuthor: function editAuthor(book) {
        book.set('isAuthorEditEnabled', true);
      },

      //false para cancelar o modo edição e desfazer as alterações no model de autor
      cancelAuthorEdit: function cancelAuthorEdit(book) {
        book.set('isAuthorEditEnabled', false);
        book.rollbackAttributes();
      },
      saveAuthor: function saveAuthor(author, book) {

        // Removendo a relação do autor com livro
        book.get('author').then(function (previousAuthor) {
          previousAuthor.get('books').then(function (previousAuthorBooks) {
            previousAuthorBooks.removeObject(book);
            previousAuthor.save();
          });
        });

        // Associação do novo autor no livro
        book.set('author', author);
        book.save().then(function () {
          return author.save();
        });
        book.set('isAuthorEditing', false);
      },


      /**
       *Ações para o objeto book na coluna titulo do template/books.hbs 
       */
      //true para flegar q o livro esta em modo edição
      editBook: function editBook(book) {
        book.set('isBookEditEnabled', true);
      },

      //false para cancelar o modo edição e desfazer as alterações no model livro
      cancelBookEdit: function cancelBookEdit(book) {
        book.set('isBookEditEnabled', false);
        book.rollbackAttributes();
      },
      saveBook: function saveBook(book) {
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
      editLibrary: function editLibrary(book) {
        book.set('isLibraryEditing', true);
      },


      //false para cancelar o modo edição e desfazer as alterações no model biblioteca
      cancelLibraryEdit: function cancelLibraryEdit(book) {
        book.set('isLibraryEditing', false);
        book.rollbackAttributes();
      },
      saveLibrary: function saveLibrary(library, book) {
        // Removendo a relação do biblioteca com livro
        book.get('library').then(function (previousLibrary) {
          previousLibrary.get('books').then(function (previousLibraryBooks) {
            previousLibraryBooks.removeObject(book);
            previousLibrary.save();
          });
        });

        book.set('library', library);
        book.save().then(function () {
          return library.save();
        });
        book.set('isLibraryEditing', false);
      }
    }
  });
});
define('library-app/routes/contact', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        model: function model() {
            return this.store.createRecord('contact');
        },


        actions: {
            sendEmail: function sendEmail(newContactMessage) {
                var _this = this;

                newContactMessage.save().then(function () {
                    return _this.controller.set('responseSendEmail', true);
                });

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
            willTransition: function willTransition() {

                var model = this.controller.get('model');

                if (model.get('isNew')) {
                    model.destroyRecord();
                }

                this.controller.set('responseSendEmail', false);
            }
        }

    });
});
define('library-app/routes/libraries/edit', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({

        //A funcao model recebe o param retornando um model do tipo library e esta recebendo um parametro
        model: function model(params) {
            //debugger;
            //O valor params.library_id veio do router.js
            //Irá buscar no banco de dados um library com o id passado
            return this.store.findRecord('library', params.library_id);
        },


        setupController: function setupController(controller, model) {

            this._super(controller, model); //herança

            controller.set('title', 'Editar biblioteca');
            controller.set('buttonLabel', 'Salvar');
        },

        renderTemplate: function renderTemplate() {
            this.render('libraries/form');
        },


        actions: {

            //ação para salvar um objeto library
            saveLibrary: function saveLibrary(library) {
                var _this = this;

                //assim que salvar redirecione para libraries.hbs
                library.save().then(function () {
                    return _this.transitionTo('libraries');
                });
            },


            //Evendo roda caso o usuario deixe a pagina
            willTransition: function willTransition(transition) {

                var model = this.controller.get('model');

                //se alguma propriedade foi alterada
                if (model.get('hasDirtyAttributes')) {

                    //debugger;

                    //pergunta oq o usuario quer fazer quer deixar a pagina.
                    var confirmation = confirm("Your changes haven't saved yet. Would you like to leave this form?");

                    if (confirmation) {
                        //se sim faz o rolback nas alterações do model
                        model.rollbackAttributes();
                    } else {
                        //caso continue na pagina
                        transition.abort();
                    }
                }
            }
        }
    });
});
define('library-app/routes/libraries/index', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        model: function model() {
            return this.store.findAll('library');
        },


        actions: {
            deleteLibrary: function deleteLibrary(library) {
                var confirmation = confirm('Are you sure?');

                if (confirmation) {
                    library.destroyRecord();
                }
            }
        }
    });
});
define('library-app/routes/libraries/new', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        model: function model() {
            return this.store.createRecord('library');
        },


        setupController: function setupController(controller, model) {

            this._super(controller, model); //herança

            controller.set('title', 'Nova Biblioteca');
            controller.set('buttonLabel', 'Novo');
        },

        renderTemplate: function renderTemplate() {
            this.render('libraries/form');
        },


        actions: {
            saveLibrary: function saveLibrary(newLibrary) {
                var _this = this;

                newLibrary.save().then(function () {
                    return _this.transitionTo('libraries');
                });
            },


            //Isso é um evento
            willTransition: function willTransition() {
                //rollbackAttributes() remove a record da store se a mesma for nova. 'isNew'

                //this.controller conseguimos acessar o controller virtual pois ele não foi criado. o Ember faz isso 
                var model = this.controller.get('model');

                if (model.get('isNew')) {
                    model.destroyRecord();
                }
            }
        }
    });
});
define('library-app/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define('library-app/services/firebase-app', ['exports', 'emberfire/services/firebase-app'], function (exports, _firebaseApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _firebaseApp.default;
});
define('library-app/services/firebase', ['exports', 'emberfire/services/firebase'], function (exports, _firebase) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _firebase.default;
});
define("library-app/templates/about", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "gdnVNs1q", "block": "{\"symbols\":[],\"statements\":[[6,\"h1\"],[7],[0,\" Em desenvolvimento ... \"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/about.hbs" } });
});
define("library-app/templates/admin/contacts", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "lpCB0jlL", "block": "{\"symbols\":[\"contact\"],\"statements\":[[2,\" app/templates/admin/invitation.hbs \"],[0,\"\\n\\n\"],[6,\"h1\"],[7],[0,\"Lista de Contatos\"],[8],[0,\"\\n\\n\"],[6,\"table\"],[9,\"class\",\"table table-bordered table-striped\"],[7],[0,\"\\n\\n    \"],[6,\"thead\"],[7],[0,\"\\n        \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Id\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"E-mail\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Mensagem\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Ação\"],[8],[0,\"\\n            \\n        \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[0,\"            \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"\\n                    \"],[1,[19,1,[\"id\"]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"\\n                    \"],[1,[19,1,[\"email\"]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                    \"],[1,[19,1,[\"message\"]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                    \"],[6,\"button\"],[9,\"class\",\"btn btn-danger btn-xs\"],[3,\"action\",[[19,0,[]],\"deleteContact\",[19,1,[]]]],[7],[0,\"Delete\"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/admin/contacts.hbs" } });
});
define("library-app/templates/admin/invitations", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "rD0C3YXC", "block": "{\"symbols\":[\"invitation\"],\"statements\":[[2,\" app/templates/admin/invitation.hbs \"],[0,\"\\n\\n\"],[6,\"h1\"],[7],[0,\"Lista de Convites\"],[8],[0,\"\\n\\n\"],[6,\"table\"],[9,\"class\",\"table table-bordered table-striped\"],[7],[0,\"\\n\\n    \"],[6,\"thead\"],[7],[0,\"\\n        \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Id\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"E-mail\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Ação\"],[8],[0,\"\\n\\n        \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[0,\"            \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"\\n                    \"],[1,[19,1,[\"id\"]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                    \"],[1,[19,1,[\"email\"]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                    \"],[6,\"button\"],[9,\"class\",\"btn btn-danger btn-xs\"],[3,\"action\",[[19,0,[]],\"deleteInvitation\",[19,1,[]]]],[7],[0,\" Delete\"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/admin/invitations.hbs" } });
});
define("library-app/templates/admin/seeder", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "JQ0PzGTU", "block": "{\"symbols\":[],\"statements\":[[2,\" app/templates/admin/seeder.hbs \"],[0,\"\\n\"],[6,\"h1\"],[7],[0,\"Gerador de dados mock com Ember-Faker\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n \"],[6,\"div\"],[9,\"class\",\"col-md-4\"],[7],[0,\"\\n     \"],[1,[25,\"number-box\",null,[[\"title\",\"number\"],[\"Bibliotecas\",[19,0,[\"libraries\",\"length\"]]]]],false],[0,\"\\n \"],[8],[0,\"\\n \"],[6,\"div\"],[9,\"class\",\"col-md-4\"],[7],[0,\"\\n     \"],[1,[25,\"number-box\",null,[[\"title\",\"number\"],[\"Autores\",[19,0,[\"authors\",\"length\"]]]]],false],[0,\"\\n \"],[8],[0,\"\\n \"],[6,\"div\"],[9,\"class\",\"col-md-4\"],[7],[0,\"\\n     \"],[1,[25,\"number-box\",null,[[\"title\",\"number\"],[\"Livros\",[19,0,[\"books\",\"length\"]]]]],false],[0,\"\\n \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[1,[25,\"seeder-block\",null,[[\"sectionTitle\",\"generateAction\",\"deleteAction\",\"generateReady\",\"deleteReady\",\"generateInProgress\",\"deleteInProgress\"],[\"Bibliotecas\",\"generateLibraries\",\"deleteLibraries\",[19,0,[\"libDone\"]],[19,0,[\"libDelDone\"]],[19,0,[\"generateLibrariesInProgress\"]],[19,0,[\"deleteLibrariesInProgress\"]]]]],false],[0,\"\\n\\n\"],[1,[25,\"seeder-block\",null,[[\"sectionTitle\",\"generateAction\",\"deleteAction\",\"generateReady\",\"deleteReady\",\"generateInProgress\",\"deleteInProgress\"],[\"Autores com Livros\",\"generateBooksAndAuthors\",\"deleteBooksAndAuthors\",[19,0,[\"authDone\"]],[19,0,[\"authDelDone\"]],[19,0,[\"generateBooksInProgress\"]],[19,0,[\"deleteBooksInProgress\"]]]]],false]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/admin/seeder.hbs" } });
});
define("library-app/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ZZh9p56Z", "block": "{\"symbols\":[],\"statements\":[[2,\"\\n<div class=\\\"container\\\">\\n    {{partial \\\"navbar\\\"}}\\n    {{outlet}}\\n</div>\\n\"],[0,\"\\n\\n\"],[12,\"navbar\",[]],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n    \"],[1,[18,\"outlet\"],false],[0,\"\\n\"],[8],[0,\"\\n\\n\\n\\n\\n\"]],\"hasEval\":true}", "meta": { "moduleName": "library-app/templates/application.hbs" } });
});
define("library-app/templates/authors", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ZHQYC1yu", "block": "{\"symbols\":[\"author\",\"book\"],\"statements\":[[6,\"h1\"],[7],[0,\"Autores\"],[8],[0,\"\\n\\n\"],[6,\"table\"],[9,\"class\",\"table table-bordered table-striped\"],[7],[0,\"\\n  \"],[6,\"thead\"],[7],[0,\"\\n    \"],[6,\"tr\"],[7],[0,\"\\n      \"],[6,\"th\"],[7],[0,\"Nome\\n        \"],[6,\"br\"],[7],[8],[6,\"small\"],[9,\"class\",\"small not-bold\"],[7],[0,\"(Clique no nome para editar)\"],[8],[0,\"\\n      \"],[8],[0,\"\\n      \"],[6,\"th\"],[9,\"class\",\"vtop\"],[7],[0,\"Livros\"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[6,\"tr\"],[7],[0,\"\\n      \"],[6,\"td\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"editEnable\"]]],null,{\"statements\":[[0,\"        \"],[6,\"form\"],[9,\"class\",\"form-inline\"],[3,\"action\",[[19,0,[]],\"saveAuthor\",[19,1,[]]],[[\"on\"],[\"submit\"]]],[7],[0,\"\\n          \"],[6,\"div\"],[9,\"class\",\"input-group\"],[7],[0,\"\\n            \"],[2,\" definindo o campo de input e botôes\"],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[19,1,[\"name\"]],\"form-comtrol\"]]],false],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"input-group-btn\"],[7],[0,\"\\n              \"],[6,\"button\"],[9,\"class\",\"btn btn-success btn-xs\"],[9,\"type\",\"submit\"],[10,\"disabled\",[19,1,[\"isNotValid\"]],null],[7],[0,\" Salvar \"],[8],[0,\"\\n              \"],[6,\"button\"],[9,\"class\",\"btn btn-danger btn-xs\"],[3,\"action\",[[19,0,[]],\"cancelAuthorEdit\",[19,1,[]]]],[7],[0,\" Cancelar \"],[8],[0,\"\\n            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"          \"],[6,\"span\"],[3,\"action\",[[19,0,[]],\"editAuthor\",[19,1,[]]]],[7],[0,\" \"],[1,[19,1,[\"name\"]],false],[0,\" \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"      \"],[8],[0,\"\\n      \"],[6,\"td\"],[7],[0,\"\\n        \"],[6,\"ul\"],[7],[0,\"\\n\"],[4,\"each\",[[19,1,[\"books\"]]],null,{\"statements\":[[0,\"          \"],[6,\"li\"],[7],[1,[19,2,[\"title\"]],false],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/authors.hbs" } });
});
define("library-app/templates/books", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "LHMmNiW6", "block": "{\"symbols\":[\"book\"],\"statements\":[[6,\"h1\"],[7],[0,\"Livros\"],[8],[0,\"\\n\\n\"],[6,\"table\"],[9,\"class\",\"table table-bordered table-striped\"],[7],[0,\"\\n  \"],[6,\"thead\"],[7],[0,\"\\n  \"],[6,\"tr\"],[7],[0,\"\\n    \"],[6,\"th\"],[9,\"class\",\"vtop wider\"],[7],[0,\"\\n      Autor\\n      \"],[6,\"br\"],[7],[8],[6,\"small\"],[9,\"class\",\"small not-bold\"],[7],[0,\"(Clique para editar)\"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"th\"],[7],[0,\"\\n      Título\\n      \"],[6,\"br\"],[7],[8],[6,\"small\"],[9,\"class\",\"small not-bold\"],[7],[0,\"(Clique para editar)\"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"th\"],[9,\"class\",\"vtop\"],[7],[0,\"Ano de Lançamento\"],[8],[0,\"\\n    \"],[6,\"th\"],[9,\"class\",\"vtop\"],[7],[0,\"\\n      Biblioteca\\n      \"],[6,\"br\"],[7],[8],[6,\"small\"],[9,\"class\",\"small not-bold\"],[7],[0,\"(Clique para editar)\"],[8],[0,\"    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[6,\"tr\"],[7],[0,\"\\n      \"],[6,\"td\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isAuthorEditEnabled\"]]],null,{\"statements\":[[0,\"\\n          \"],[1,[25,\"author-select\",null,[[\"book\",\"authors\",\"default\",\"action\"],[[19,1,[]],[19,0,[\"authors\"]],[19,1,[\"author\"]],\"saveAuthor\"]]],false],[0,\"\\n\\n          \"],[6,\"button\"],[9,\"class\",\"btn btn-danger\"],[3,\"action\",[[19,0,[]],\"cancelAuthorEdit\",[19,1,[]]]],[7],[0,\"Cancel\"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"          \"],[6,\"span\"],[3,\"action\",[[19,0,[]],\"editAuthor\",[19,1,[]]]],[7],[1,[19,1,[\"author\",\"name\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"      \"],[8],[0,\"\\n\\n      \"],[6,\"td\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isBookEditEnabled\"]]],null,{\"statements\":[[0,\"          \"],[6,\"form\"],[9,\"class\",\"form-inline\"],[3,\"action\",[[19,0,[]],\"saveBook\",[19,1,[]]],[[\"on\"],[\"submit\"]]],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"input-group\"],[7],[0,\"\\n              \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[19,1,[\"title\"]],\"form-control\"]]],false],[0,\"\\n              \"],[6,\"div\"],[9,\"class\",\"input-group-btn\"],[7],[0,\"\\n                \"],[6,\"button\"],[9,\"type\",\"submit\"],[9,\"class\",\"btn btn-success btn-xs\"],[10,\"disabled\",[19,1,[\"isNotValid\"]],null],[7],[0,\"Save\"],[8],[0,\"\\n                \"],[6,\"button\"],[9,\"class\",\"btn btn-danger btn-xs\"],[3,\"action\",[[19,0,[]],\"cancelBookEdit\",[19,1,[]]]],[7],[0,\"Cancel\"],[8],[0,\"\\n              \"],[8],[0,\"\\n            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"          \"],[6,\"span\"],[3,\"action\",[[19,0,[]],\"editBook\",[19,1,[]]]],[7],[1,[19,1,[\"title\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"      \"],[8],[0,\"\\n\\n      \"],[6,\"td\"],[7],[1,[19,1,[\"releaseYear\"]],false],[8],[0,\"\\n      \"],[6,\"td\"],[7],[0,\"\\n\\n\"],[4,\"if\",[[19,1,[\"isLibraryEditing\"]]],null,{\"statements\":[[0,\"\\n          \"],[1,[25,\"library-select\",null,[[\"book\",\"libraries\",\"default\",\"action\"],[[19,1,[]],[19,0,[\"libraries\"]],[19,1,[\"library\"]],\"saveLibrary\"]]],false],[0,\"\\n \\n          \"],[6,\"button\"],[9,\"class\",\"btn btn-danger\"],[3,\"action\",[[19,0,[]],\"cancelLibraryEdit\",[19,1,[]]]],[7],[0,\"Cancel\"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"          \"],[6,\"span\"],[3,\"action\",[[19,0,[]],\"editLibrary\",[19,1,[]]]],[7],[1,[19,1,[\"library\",\"name\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/books.hbs" } });
});
define("library-app/templates/components/author-select", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "MRwlyccW", "block": "{\"symbols\":[\"author\"],\"statements\":[[4,\"each\",[[19,0,[\"authors\"]]],null,{\"statements\":[[0,\"\\n  \"],[6,\"option\"],[10,\"value\",[19,1,[\"id\"]],null],[10,\"selected\",[25,\"is-equal\",[[19,1,[\"id\"]],[19,0,[\"default\",\"id\"]]],null],null],[7],[0,\"\\n    \"],[1,[19,1,[\"name\"]],false],[0,\"\\n  \"],[8],[0,\"\\n\\n\"]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/components/author-select.hbs" } });
});
define("library-app/templates/components/fader-label", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "QvzLatYC", "block": "{\"symbols\":[\"&default\"],\"statements\":[[2,\" app/templates/components/fader-label.hbs \"],[0,\"\\n\"],[11,1],[0,\" \"]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/components/fader-label.hbs" } });
});
define("library-app/templates/components/library-item-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "qO0Tke25", "block": "{\"symbols\":[],\"statements\":[[2,\" app/templates/components/library-item-form.hbs \"],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"form-horizontal\"],[7],[0,\"\\n  \"],[6,\"div\"],[10,\"class\",[26,[\"form-group has-feedback \",[25,\"if\",[[19,0,[\"item\",\"isValid\"]],\"has-success\"],null]]]],[7],[0,\"\\n    \"],[6,\"label\"],[9,\"class\",\"col-sm-2 control-label\"],[7],[0,\"Nome\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-sm-10\"],[7],[0,\"\\n      \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[19,0,[\"item\",\"name\"]],\"form-control\",\"Nome da biblioteca\"]]],false],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n    \"],[6,\"label\"],[9,\"class\",\"col-sm-2 control-label\"],[7],[0,\"Endereço\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-sm-10\"],[7],[0,\"\\n      \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[19,0,[\"item\",\"address\"]],\"form-control\",\"Endereço da biblioteca\"]]],false],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n    \"],[6,\"label\"],[9,\"class\",\"col-sm-2 control-label\"],[7],[0,\"Telefone\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-sm-10\"],[7],[0,\"\\n      \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[19,0,[\"item\",\"phone\"]],\"form-control\",\"Telefone da biblioteca\"]]],false],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-sm-offset-2 col-sm-10\"],[7],[0,\"\\n      \"],[6,\"button\"],[9,\"type\",\"submit\"],[9,\"class\",\"btn btn-success\"],[10,\"disabled\",[25,\"unless\",[[19,0,[\"item\",\"isValid\"]],true],null],null],[3,\"action\",[[19,0,[]],\"buttonClicked\",[19,0,[\"item\"]]]],[7],[1,[18,\"buttonLabel\"],false],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\" \"]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/components/library-item-form.hbs" } });
});
define("library-app/templates/components/library-item", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "z7kvyrZI", "block": "{\"symbols\":[\"&default\"],\"statements\":[[6,\"div\"],[9,\"class\",\"panel panel-default library-item\"],[7],[0,\"\\n\\n    \"],[6,\"div\"],[9,\"class\",\"panel-heading\"],[7],[0,\"\\n        \"],[6,\"h3\"],[9,\"class\",\"panel-title\"],[7],[0,\"Titulo: \"],[1,[20,[\"item\",\"name\"]],false],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"panel-body\"],[7],[0,\"\\n        \"],[6,\"p\"],[7],[0,\"Endereço: \"],[1,[20,[\"item\",\"address\"]],false],[8],[0,\"\\n        \"],[6,\"p\"],[7],[0,\"Telefone: \"],[1,[20,[\"item\",\"phone\"]],false],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"panel-footer text-right\"],[7],[0,\"\\n        \"],[2,\" O campo {{yield}} significa que podemos usar esse componente como um componente de bloco. \\n        O código que este componente envolve será injetado dentro do {{yield}}\\n        Por exemplo:\\n{{#library-item item=model}}\\n        <br/>\\n        {{/library-item}}        \"],[0,\"\\n        \"],[11,1],[0,\"\\n    \"],[8],[0,\"\\n\\n\"],[8],[0,\" \"]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/components/library-item.hbs" } });
});
define("library-app/templates/components/library-select", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "46mQ5F3b", "block": "{\"symbols\":[\"library\"],\"statements\":[[4,\"each\",[[19,0,[\"libraries\"]]],null,{\"statements\":[[0,\"    \"],[6,\"option\"],[10,\"value\",[19,1,[\"id\"]],null],[10,\"selected\",[25,\"is-equal\",[[19,1,[\"id\"]],[19,0,[\"default\",\"id\"]]],null],null],[7],[0,\"\\n        \"],[1,[19,1,[\"name\"]],false],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/components/library-select.hbs" } });
});
define("library-app/templates/components/nav-link-to", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "c0wqxBOa", "block": "{\"symbols\":[\"&default\"],\"statements\":[[2,\" app/templates/components/nav-link-to.hbs \"],[0,\"\\n\"],[6,\"a\"],[9,\"href\",\"\"],[7],[11,1],[8],[0,\" \"]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/components/nav-link-to.hbs" } });
});
define("library-app/templates/components/number-box", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "C5HAbXLl", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"panel-heading\"],[7],[0,\"\\n\\n    \"],[6,\"h3\"],[9,\"class\",\"text-center\"],[7],[1,[18,\"title\"],false],[8],[0,\"\\n    \"],[2,\" se for passado um numero escreve um numero, caso contrario tres pontinhos \"],[0,\"\\n    \"],[6,\"h1\"],[9,\"class\",\"text-center\"],[7],[1,[25,\"if\",[[19,0,[\"number\"]],[19,0,[\"number\"]],\"...\"],null],false],[8],[0,\"\\n\"],[8],[0,\"\\n\\n \"]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/components/number-box.hbs" } });
});
define("library-app/templates/components/seeder-block", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "AOlfyYjs", "block": "{\"symbols\":[],\"statements\":[[2,\" app/templates/components/seeder-block.hbs \"],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"well well-sm extra-padding-bottom\"],[7],[0,\"\\n  \"],[6,\"h3\"],[7],[1,[18,\"sectionTitle\"],false],[8],[0,\"\\n  \\n  \"],[6,\"div\"],[9,\"class\",\"form-inline\"],[7],[0,\"\\n  \\n   \"],[6,\"div\"],[10,\"class\",[26,[\"form-group has-feedback \",[25,\"unless\",[[19,0,[\"isCounterValid\"]],\"has-error\"],null]]]],[7],[0,\"\\n     \"],[6,\"label\"],[9,\"class\",\"control-label\"],[7],[0,\"Quantidade de registros:\"],[8],[0,\"\\n     \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[19,0,[\"counter\"]],\"form-control\",[19,0,[\"placeholder\"]]]]],false],[0,\"\\n   \"],[8],[0,\"\\n  \\n   \"],[6,\"button\"],[9,\"class\",\"btn btn-primary\"],[10,\"disabled\",[18,\"generateIsDisabled\"],null],[3,\"action\",[[19,0,[]],\"generateAction\"]],[7],[0,\"\\n\"],[4,\"if\",[[19,0,[\"generateInProgress\"]]],null,{\"statements\":[[0,\"       \"],[6,\"span\"],[9,\"class\",\"glyphicon glyphicon-refresh spinning\"],[7],[8],[0,\" Gerando...\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"       Gerar \"],[1,[18,\"sectionTitle\"],false],[0,\"\\n\"]],\"parameters\":[]}],[0,\"   \"],[8],[0,\"\\n   \"],[4,\"fader-label\",null,[[\"isShowing\"],[[19,0,[\"generateReady\"]]]],{\"statements\":[[0,\"Created!\"]],\"parameters\":[]},null],[0,\"\\n  \\n   \"],[6,\"button\"],[9,\"class\",\"btn btn-danger\"],[10,\"disabled\",[18,\"deleteIsDisabled\"],null],[3,\"action\",[[19,0,[]],\"deleteAction\"]],[7],[0,\"\\n\"],[4,\"if\",[[19,0,[\"deleteInProgress\"]]],null,{\"statements\":[[0,\"       \"],[6,\"span\"],[9,\"class\",\"glyphicon glyphicon-refresh spinning\"],[7],[8],[0,\" Removendo...\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"       Remover \"],[1,[18,\"sectionTitle\"],false],[0,\"\\n\"]],\"parameters\":[]}],[0,\"   \"],[8],[0,\"\\n   \"],[4,\"fader-label\",null,[[\"isShowing\"],[[19,0,[\"deleteReady\"]]]],{\"statements\":[[0,\"Deleted!\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\" \"]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/components/seeder-block.hbs" } });
});
define("library-app/templates/contact", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ngHjek0d", "block": "{\"symbols\":[],\"statements\":[[6,\"h1\"],[7],[0,\"Contato\"],[8],[0,\"\\n\\n\"],[6,\"p\"],[9,\"class\",\"well well-sm\"],[7],[0,\"\\n    Se tiver alguma dúvida ou sugestão para de um Livro, mande um email!\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-md-6\"],[7],[0,\"\\n\\n\"],[4,\"if\",[[19,0,[\"responseSendEmail\"]]],null,{\"statements\":[[0,\"            \\n            \"],[6,\"div\"],[9,\"class\",\"col-md-6\"],[7],[0,\"\\n            \\n                \"],[6,\"br\"],[7],[8],[0,\"\\n            \\n                \"],[6,\"div\"],[9,\"class\",\"alert alert-success\"],[7],[0,\"\\n                    \"],[6,\"h4\"],[7],[0,\"Obrigado! Seu email foi enviado.\"],[8],[0,\"\\n                    \\n                    \"],[6,\"p\"],[7],[0,\"Para: \"],[1,[20,[\"model\",\"email\"]],false],[8],[0,\"\\n                    \"],[6,\"p\"],[7],[0,\"Mensagem: \"],[1,[20,[\"model\",\"message\"]],false],[8],[0,\"\\n                    \"],[6,\"p\"],[7],[0,\"ID: \"],[1,[20,[\"model\",\"id\"]],false],[8],[0,\"\\n                \\n                \"],[8],[0,\"\\n            \\n            \"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\n            \"],[6,\"div\"],[10,\"class\",[26,[\"form-group has-feedback \",[25,\"if\",[[19,0,[\"model\",\"isValidEmail\"]],\"has-success\"],null]]]],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Seu endereço de email*:\"],[8],[0,\" \\n                \"],[1,[25,\"input\",null,[[\"type\",\"class\",\"placeholder\",\"value\",\"autofocus\"],[\"email\",\"form-control\",\"Digite seu email\",[19,0,[\"model\",\"email\"]],\"autofocus\"]]],false],[0,\"\\n\"],[4,\"if\",[[19,0,[\"model\",\"isValidEmail\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"span\"],[9,\"class\",\"glyphicon glyphicon-ok form-control-feedback\"],[9,\"aria-hidden\",\"true\"],[7],[8],[0,\"\\n                    \"],[6,\"span\"],[9,\"id\",\"inputSuccess2Status\"],[9,\"class\",\"sr-only\"],[7],[0,\"(success)\"],[8],[0,\" \\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n\\n            \"],[6,\"div\"],[10,\"class\",[26,[\"form-group has-feedback \",[25,\"if\",[[19,0,[\"model\",\"hasEnoughText\"]],\"has-success\"],null]]]],[7],[0,\"\\n                \"],[6,\"label\"],[7],[0,\"Sua mensagem*:\"],[8],[0,\" \\n                \"],[1,[25,\"textarea\",null,[[\"class\",\"placeholder\",\"rows\",\"value\"],[\"form-control\",\"Escreva sua mensagem. (Mínimo de 5 caracteres.)\",\"7\",[19,0,[\"model\",\"message\"]]]]],false],[0,\" \\n                \\n\"],[4,\"if\",[[19,0,[\"model\",\"hasEnoughText\"]]],null,{\"statements\":[[0,\"                    \"],[6,\"span\"],[9,\"class\",\"glyphicon glyphicon-ok form-control-feedback\"],[9,\"aria-hidden\",\"true\"],[7],[8],[0,\"\\n                    \"],[6,\"span\"],[9,\"id\",\"inputSuccess2Status\"],[9,\"class\",\"sr-only\"],[7],[0,\"(success)\"],[8],[0,\" \\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n            \"],[6,\"button\"],[9,\"class\",\"btn btn-success\"],[10,\"disabled\",[20,[\"model\",\"isNotValid\"]],null],[3,\"action\",[[19,0,[]],\"sendEmail\",[19,0,[\"model\"]]]],[7],[0,\"Enviar\"],[8],[0,\" \\n\"]],\"parameters\":[]}],[0,\"\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/contact.hbs" } });
});
define("library-app/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "GQX37lyT", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"jumbotron text-center\"],[7],[0,\"\\n\\n    \"],[6,\"h1\"],[7],[0,\"Em breve\"],[8],[0,\"\\n\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n    \"],[6,\"p\"],[7],[0,\"\\n        Garanta agora seu convite para o lançamento novos livros!!!     \\n    \"],[8],[0,\"\\n\\n\\n    \"],[6,\"div\"],[9,\"class\",\"form-horizontal form-group form-group-lg row\"],[7],[0,\"\\n        \\n        \"],[6,\"div\"],[9,\"class\",\"col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-1 col-md-5 col-md-offset-2\"],[7],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"class\",\"placeholder\",\"autofocus\"],[\"email\",[19,0,[\"emailAddress\"]],\"form-control\",\"Por favor, digite seu e-mail.\",\"autofocus\"]]],false],[0,\"\\n        \"],[8],[0,\"\\n        \\n        \"],[6,\"div\"],[9,\"class\",\"col-xs-10 col-xs-offset-1 col-sm-offset-0 col-sm-4 col-md-3\"],[7],[0,\"\\n            \"],[6,\"button\"],[10,\"disabled\",[18,\"isDisabled\"],null],[9,\"class\",\"btn btn-primary btn-lg btn-block\"],[3,\"action\",[[19,0,[]],\"saveInvitation\"]],[7],[0,\"Pedir convite\"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \\n    \"],[8],[0,\"\\n\"],[4,\"if\",[[19,0,[\"responseMessage\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"alert alert-success\"],[7],[0,\"\\n            \"],[1,[18,\"responseMessage\"],false],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/index.hbs" } });
});
define("library-app/templates/libraries", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "FJSifHIS", "block": "{\"symbols\":[],\"statements\":[[2,\" app/templates/libraries.hbs \"],[0,\"\\n\"],[6,\"h1\"],[7],[0,\"Bibliotecas\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"well\"],[7],[0,\"\\n  \"],[6,\"ul\"],[9,\"class\",\"nav nav-tabs\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"libraries.index\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[6,\"a\"],[9,\"href\",\"\"],[7],[0,\"Listar\"],[8]],\"parameters\":[]},null],[0,\"\\n    \"],[4,\"link-to\",[\"libraries.new\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[6,\"a\"],[9,\"href\",\"\"],[7],[0,\"Novo\"],[8]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[2,\" Aqui renderizará o conteudo de libraries/index.hbs \"],[0,\" \\n\"],[1,[18,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/libraries.hbs" } });
});
define("library-app/templates/libraries/form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "MNpkDyNF", "block": "{\"symbols\":[],\"statements\":[[2,\" app/templates/libraries/form.hbs \"],[0,\"\\n\"],[2,\" \\n    O link libraries.new chamara a route.js (this.route('new');)\\n    Em seguida o routes/libraries/new.js renderizará o libraries/form.hbs \\n    usando o metodo  renderTemplate()\\n \"],[0,\"\\n\"],[6,\"h2\"],[7],[1,[18,\"title\"],false],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n\\n  \"],[6,\"div\"],[9,\"class\",\"col-md-6\"],[7],[0,\"\\n    \"],[2,\" Faz uso de um componente library-item-form(library-item-form.hbs), que fica  esquerda da tela\"],[0,\"\\n    \"],[1,[25,\"library-item-form\",null,[[\"item\",\"buttonLabel\",\"action\"],[[19,0,[\"model\"]],[19,0,[\"buttonLabel\"]],\"saveLibrary\"]]],false],[0,\"    \\n  \"],[8],[0,\"\\n\\n  \"],[6,\"div\"],[9,\"class\",\"col-md-4\"],[7],[0,\"\\n    \"],[2,\" Faz uso de um outro um componente library-item(library-item.hbs) que é um card q recebe as informações do fomulário dicamicamente \"],[0,\"\\n\"],[4,\"library-item\",null,[[\"item\"],[[19,0,[\"model\"]]]],{\"statements\":[[0,\"      \"],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/libraries/form.hbs" } });
});
define("library-app/templates/libraries/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "tKvh3dmd", "block": "{\"symbols\":[\"library\"],\"statements\":[[2,\" app/templates/libraries/index.hbs \"],[0,\"\\n\"],[6,\"h2\"],[7],[0,\"Lista de Bibliotecas\"],[8],[0,\"\\n\\n\"],[4,\"if\",[[19,0,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[0,\"            \"],[6,\"div\"],[9,\"class\",\"col-md-4\"],[7],[0,\"\\n              \"],[2,\" o componente library-item.hbs recebe um obj library como parametro  \"],[0,\"\\n\"],[4,\"library-item\",null,[[\"item\"],[[19,1,[]]]],{\"statements\":[[0,\"                \"],[4,\"link-to\",[\"libraries.edit\",[19,1,[\"id\"]]],[[\"class\"],[\"btn btn success btn-xs\"]],{\"statements\":[[0,\"Edtar\"]],\"parameters\":[]},null],[0,\"\\n                \"],[6,\"button\"],[9,\"class\",\"btn btn-danger btn-xs\"],[3,\"action\",[[19,0,[]],\"deleteLibrary\",[19,1,[]]]],[7],[0,\"Remover\"],[8],[0,\" \\n\"]],\"parameters\":[]},null],[0,\"            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"    \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"alert alert-info\"],[9,\"role\",\"alert\"],[7],[0,\"Nenhum registro encontrado...\"],[8],[0,\" \\n\"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/libraries/index.hbs" } });
});
define("library-app/templates/navbar", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "louUBDwb", "block": "{\"symbols\":[],\"statements\":[[2,\" app/templates/navbar.hbs \"],[0,\"\\n\"],[6,\"nav\"],[9,\"class\",\"navbar navbar-inverse\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container-fluid\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"navbar-header\"],[7],[0,\"\\n            \"],[6,\"button\"],[9,\"type\",\"button\"],[9,\"class\",\"navbar-toggle collapsed\"],[9,\"data-toggle\",\"collapse\"],[9,\"data-target\",\"#main-navbar\"],[7],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"sr-only\"],[7],[0,\"Toggle navigation\"],[8],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"icon-bar\"],[7],[8],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"icon-bar\"],[7],[8],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"icon-bar\"],[7],[8],[0,\"\\n            \"],[8],[0,\" \"],[4,\"link-to\",[\"index\"],[[\"class\"],[\"navbar-brand\"]],{\"statements\":[[0,\"Biblio App\"]],\"parameters\":[]},null],[0,\"\\n        \"],[8],[0,\"\\n\\n        \"],[6,\"div\"],[9,\"class\",\"collapse navbar-collapse\"],[9,\"id\",\"main-navbar\"],[7],[0,\"\\n            \"],[6,\"ul\"],[9,\"class\",\"nav navbar-nav\"],[7],[0,\"\\n                \"],[4,\"nav-link-to\",[\"index\"],null,{\"statements\":[[0,\"Home\"]],\"parameters\":[]},null],[0,\" \\n                \"],[4,\"nav-link-to\",[\"libraries\"],null,{\"statements\":[[0,\"Bibliotecas\"]],\"parameters\":[]},null],[0,\"\\n                \"],[4,\"nav-link-to\",[\"authors\"],null,{\"statements\":[[0,\"Autores\"]],\"parameters\":[]},null],[0,\"\\n                \"],[4,\"nav-link-to\",[\"books\"],null,{\"statements\":[[0,\"Livros\"]],\"parameters\":[]},null],[0,\" \\n                \\n            \"],[8],[0,\"\\n \\n            \"],[6,\"ul\"],[9,\"class\",\"nav navbar-nav navbar-right\"],[7],[0,\"\\n                \"],[4,\"nav-link-to\",[\"about\"],null,{\"statements\":[[0,\"Sobre\"]],\"parameters\":[]},null],[0,\"\\n                \"],[4,\"nav-link-to\",[\"contact\"],null,{\"statements\":[[0,\"Contato\"]],\"parameters\":[]},null],[0,\"\\n                \"],[6,\"li\"],[9,\"class\",\"dropdown\"],[7],[0,\"\\n                    \"],[6,\"a\"],[9,\"class\",\"dropdown-toggle\"],[9,\"data-toggle\",\"dropdown\"],[9,\"role\",\"button\"],[9,\"aria-haspopup\",\"true\"],[9,\"aria-expanded\",\"false\"],[7],[0,\"\\n                            Admin\\n                            \"],[6,\"span\"],[9,\"class\",\"caret\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[6,\"ul\"],[9,\"class\",\"dropdown-menu\"],[7],[0,\"\\n                        \"],[4,\"nav-link-to\",[\"admin.invitations\"],null,{\"statements\":[[0,\"Convite\"]],\"parameters\":[]},null],[0,\" \\n                        \"],[4,\"nav-link-to\",[\"admin.contacts\"],null,{\"statements\":[[0,\"Contatos\"]],\"parameters\":[]},null],[0,\"\\n                        \"],[4,\"nav-link-to\",[\"admin.seeder\"],null,{\"statements\":[[0,\"Populador de Dados\"]],\"parameters\":[]},null],[0,\" \\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[2,\" end menu dropdown \"],[0,\"\\n        \"],[8],[0,\"\\n        \"],[2,\" /.navbar-collapse \"],[0,\"\\n    \"],[8],[0,\"\\n    \"],[2,\" /.container-fluid \"],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/navbar.hbs" } });
});
define('library-app/torii-providers/firebase', ['exports', 'emberfire/torii-providers/firebase'], function (exports, _firebase) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _firebase.default;
});


define('library-app/config/environment', ['ember'], function(Ember) {
  var prefix = 'library-app';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("library-app/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_TRANSITIONS":true,"LOG_TRANSITIONS_INTERNAL":true,"LOG_VIEW_LOOKUPS":true,"name":"library-app","version":"0.0.0+a1cc6b4f"});
}
//# sourceMappingURL=library-app.map
