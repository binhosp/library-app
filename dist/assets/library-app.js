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

        // Progress flag, data-down to seeder-block where our lovely button will show a spinner...
        this.set('generateLibrariesInProgress', true);

        var counter = parseInt(volume);
        var savedLibraries = [];

        for (var i = 0; i < counter; i++) {

          // Collect all Promise in an array
          savedLibraries.push(this._saveRandomLibrary());
        }

        // Wait for all Promise to fulfill so we can show our label and turn off the spinner.
        Ember.RSVP.all(savedLibraries).then(function () {
          _this.set('generateLibrariesInProgress', false);
          _this.set('libDone', true);
        });
      },
      deleteLibraries: function deleteLibraries() {
        var _this2 = this;

        // Progress flag, data-down to seeder-block button spinner.
        this.set('deleteLibrariesInProgress', true);

        // Our local _destroyAll return a promise, we change the label when all records destroyed.
        this._destroyAll(this.get('libraries'))

        // Data down via seeder-block to fader-label that we ready to show the label.
        // Change the progress indicator also, so the spinner can be turned off.
        .then(function () {
          _this2.set('libDelDone', true);
          _this2.set('deleteLibrariesInProgress', false);
        });
      },
      generateBooksAndAuthors: function generateBooksAndAuthors(volume) {
        var _this3 = this;

        // Progress flag, data-down to seeder-block button spinner.
        this.set('generateBooksInProgress', true);

        var counter = parseInt(volume);
        var booksWithAuthors = [];

        for (var i = 0; i < counter; i++) {

          // Collect Promises in an array.
          var books = this._saveRandomAuthor().then(function (newAuthor) {
            return _this3._generateSomeBooks(newAuthor);
          });
          booksWithAuthors.push(books);
        }

        // Let's wait until all async save resolved, show a label and turn off the spinner.
        Ember.RSVP.all(booksWithAuthors)

        // Data down via seeder-block to fader-label that we ready to show the label
        // Change the progress flag also, so the spinner can be turned off.
        .then(function () {
          _this3.set('authDone', true);
          _this3.set('generateBooksInProgress', false);
        });
      },
      deleteBooksAndAuthors: function deleteBooksAndAuthors() {
        var _this4 = this;

        // Progress flag, data-down to seeder-block button to show spinner.
        this.set('deleteBooksInProgress', true);

        var authors = this.get('authors');
        var books = this.get('books');

        // Remove authors first and books later, finally show the label.
        this._destroyAll(authors).then(function () {
          return _this4._destroyAll(books);
        })

        // Data down via seeder-block to fader-label that we ready to show the label
        // Delete is finished, we can turn off the spinner in seeder-block button.
        .then(function () {
          _this4.set('authDelDone', true);
          _this4.set('deleteBooksInProgress', false);
        });
      }
    },

    // Private methods

    // Create a new library record and uses the randomizator, which is in our model and generates some fake data in
    // the new record. After we save it, which is a promise, so this returns a promise.
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

        // Creating and saving book, saving the related records also are take while, they are all a Promise.
        var bookPromise = _this5.store.createRecord('book').randomize(author, library).save().then(function () {
          return author.save();
        })

        // guard library in case if we don't have any
        .then(function () {
          return library && library.save();
        });
        books.push(bookPromise);
      };

      for (var j = 0; j < bookCounter; j++) {
        _loop(j);
      }

      // Return a Promise, so we can manage the whole process on time
      return Ember.RSVP.all(books);
    },
    _selectRandomLibrary: function _selectRandomLibrary() {

      // Please note libraries are records from store, which means this is a DS.RecordArray object, it is extended from
      // Ember.ArrayProxy. If you need an element from this list, you cannot just use libraries[3], we have to use
      // libraries.objectAt(3)
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

        headerMessage: 'Coming Soon',
        responseMessage: '',
        emailAddress: '',

        actions: {
            saveInvitation: function saveInvitation() {
                var _this = this;

                var email = this.get('emailAddress');

                var newInvitation = this.store.createRecord('invitation', {
                    email: email
                });

                newInvitation.save().then(function (response) {
                    _this.set('responseMessage', 'Thank you ! We\'ve just saved your email address: ' + _this.get('emailAddress') + ' with id: ' + response.get('id'));
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
      this.set('name', _faker.default.name.findName());
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
      this.set('title', this._bookTitle());
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
      editAuthor: function editAuthor(author) {
        author.set('isEditing', true);
      },
      cancelAuthorEdit: function cancelAuthorEdit(author) {
        author.set('isEditing', false);
        author.rollbackAttributes();
      },
      saveAuthor: function saveAuthor(author) {

        if (author.get('isNotValid')) {
          return;
        }

        author.set('isEditing', false);
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
      return Ember.RSVP.hash({
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
      editBook: function editBook(book) {
        book.set('isEditing', true);
      },
      cancelBookEdit: function cancelBookEdit(book) {
        book.set('isEditing', false);
        book.rollbackAttributes();
      },
      saveBook: function saveBook(book) {
        if (book.get('isNotValid')) {
          return;
        }

        book.set('isEditing', false);
        book.save();
      },
      editAuthor: function editAuthor(book) {
        book.set('isAuthorEditing', true);
      },
      cancelAuthorEdit: function cancelAuthorEdit(book) {
        book.set('isAuthorEditing', false);
        book.rollbackAttributes();
      },
      saveAuthor: function saveAuthor(author, book) {
        // Firebase adapter is buggy, we have to manually remove the previous relation
        book.get('author').then(function (previousAuthor) {
          previousAuthor.get('books').then(function (previousAuthorBooks) {
            previousAuthorBooks.removeObject(book);
            previousAuthor.save();
          });
        });

        // Setup the new relation
        book.set('author', author);
        book.save().then(function () {
          return author.save();
        });
        book.set('isAuthorEditing', false);
      },
      editLibrary: function editLibrary(book) {
        book.set('isLibraryEditing', true);
      },
      cancelLibraryEdit: function cancelLibraryEdit(book) {
        book.set('isLibraryEditing', false);
        book.rollbackAttributes();
      },
      saveLibrary: function saveLibrary(library, book) {
        // Firebase adapter is buggy, we have to manually remove the previous relation.
        // You don't need this callback mess when your adapter properly manages relations.
        // If Firebase fix this bug, we can remove this part.
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

                //newContactMessage.save().then(() => this.controller.set('responseMessage', true));
                newContactMessage.save().then(function () {
                    return _this.controller.set('responseSendEmail', true);
                });

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

            controller.set('title', 'Edit library');
            controller.set('buttonLabel', 'Save changes');
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

            controller.set('title', 'Create a new library');
            controller.set('buttonLabel', 'Create');
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
  exports.default = Ember.HTMLBars.template({ "id": "2D95zSsf", "block": "{\"symbols\":[],\"statements\":[[6,\"h1\"],[7],[0,\"About Page\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/about.hbs" } });
});
define("library-app/templates/admin/contacts", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "lYL1Mwh9", "block": "{\"symbols\":[\"contact\"],\"statements\":[[2,\" app/templates/admin/invitation.hbs \"],[0,\"\\n\\n\"],[6,\"h1\"],[7],[0,\"Contacts\"],[8],[0,\"\\n\\n\"],[6,\"table\"],[9,\"class\",\"table table-bordered table-striped\"],[7],[0,\"\\n\\n    \"],[6,\"thead\"],[7],[0,\"\\n        \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Id\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"E-mail\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Message\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Action\"],[8],[0,\"\\n            \\n        \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[0,\"            \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"\\n                    \"],[1,[19,1,[\"id\"]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"\\n                    \"],[1,[19,1,[\"email\"]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                    \"],[1,[19,1,[\"message\"]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                    \"],[6,\"button\"],[9,\"class\",\"btn btn-danger btn-xs\"],[3,\"action\",[[19,0,[]],\"deleteContact\",[19,1,[]]]],[7],[0,\"Delete\"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/admin/contacts.hbs" } });
});
define("library-app/templates/admin/invitations", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "1zNTUjQW", "block": "{\"symbols\":[\"invitation\"],\"statements\":[[2,\" app/templates/admin/invitation.hbs \"],[0,\"\\n\\n\"],[6,\"h1\"],[7],[0,\"invitations\"],[8],[0,\"\\n\\n\"],[6,\"table\"],[9,\"class\",\"table table-bordered table-striped\"],[7],[0,\"\\n\\n    \"],[6,\"thead\"],[7],[0,\"\\n        \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"ID\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"E-mail\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"Action\"],[8],[0,\"\\n\\n        \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[0,\"            \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"\\n                    \"],[1,[19,1,[\"id\"]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                    \"],[1,[19,1,[\"email\"]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                    \"],[6,\"button\"],[9,\"class\",\"btn btn-danger btn-xs\"],[3,\"action\",[[19,0,[]],\"deleteInvitation\",[19,1,[]]]],[7],[0,\" Delete\"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/admin/invitations.hbs" } });
});
define("library-app/templates/admin/seeder", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "FgCjlPrd", "block": "{\"symbols\":[],\"statements\":[[2,\" app/templates/admin/seeder.hbs \"],[0,\"\\n\"],[6,\"h1\"],[7],[0,\"Seeder, our Data Center\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n \"],[6,\"div\"],[9,\"class\",\"col-md-4\"],[7],[1,[25,\"number-box\",null,[[\"title\",\"number\"],[\"Libraries\",[19,0,[\"libraries\",\"length\"]]]]],false],[8],[0,\"\\n \"],[6,\"div\"],[9,\"class\",\"col-md-4\"],[7],[1,[25,\"number-box\",null,[[\"title\",\"number\"],[\"Authors\",[19,0,[\"authors\",\"length\"]]]]],false],[8],[0,\"\\n \"],[6,\"div\"],[9,\"class\",\"col-md-4\"],[7],[1,[25,\"number-box\",null,[[\"title\",\"number\"],[\"Books\",[19,0,[\"books\",\"length\"]]]]],false],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[1,[25,\"seeder-block\",null,[[\"sectionTitle\",\"generateAction\",\"deleteAction\",\"generateReady\",\"deleteReady\",\"generateInProgress\",\"deleteInProgress\"],[\"Libraries\",\"generateLibraries\",\"deleteLibraries\",[19,0,[\"libDone\"]],[19,0,[\"libDelDone\"]],[19,0,[\"generateLibrariesInProgress\"]],[19,0,[\"deleteLibrariesInProgress\"]]]]],false],[0,\"\\n\\n\"],[1,[25,\"seeder-block\",null,[[\"sectionTitle\",\"generateAction\",\"deleteAction\",\"generateReady\",\"deleteReady\",\"generateInProgress\",\"deleteInProgress\"],[\"Authors with Books\",\"generateBooksAndAuthors\",\"deleteBooksAndAuthors\",[19,0,[\"authDone\"]],[19,0,[\"authDelDone\"]],[19,0,[\"generateBooksInProgress\"]],[19,0,[\"deleteBooksInProgress\"]]]]],false]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/admin/seeder.hbs" } });
});
define("library-app/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "uj4p/m5d", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n    \"],[12,\"navbar\",[]],[0,\"\\n    \"],[1,[18,\"outlet\"],false],[0,\"\\n\"],[8]],\"hasEval\":true}", "meta": { "moduleName": "library-app/templates/application.hbs" } });
});
define("library-app/templates/authors", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "haVNeawd", "block": "{\"symbols\":[\"author\",\"book\"],\"statements\":[[6,\"h1\"],[7],[0,\"Authors\"],[8],[0,\"\\n\\n \"],[6,\"table\"],[9,\"class\",\"table table-bordered table-striped\"],[7],[0,\"\\n   \"],[6,\"thead\"],[7],[0,\"\\n     \"],[6,\"tr\"],[7],[0,\"\\n       \"],[6,\"th\"],[7],[0,\"Name\"],[8],[0,\"\\n       \"],[6,\"th\"],[7],[0,\"Books\"],[8],[0,\"\\n     \"],[8],[0,\"\\n   \"],[8],[0,\"\\n   \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[0,\"       \"],[6,\"tr\"],[7],[0,\"\\n         \"],[6,\"td\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n         \"],[6,\"td\"],[7],[0,\"\\n           \"],[6,\"ul\"],[7],[0,\"\\n\"],[4,\"each\",[[19,1,[\"books\"]]],null,{\"statements\":[[0,\"               \"],[6,\"li\"],[7],[1,[19,2,[\"title\"]],false],[8],[0,\"\\n\"]],\"parameters\":[2]},null],[0,\"           \"],[8],[0,\"\\n         \"],[8],[0,\"\\n       \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"   \"],[8],[0,\"\\n \"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/authors.hbs" } });
});
define("library-app/templates/books", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "F35H7cSm", "block": "{\"symbols\":[\"book\"],\"statements\":[[6,\"h1\"],[7],[0,\"Books\"],[8],[0,\"\\n\\n\"],[6,\"table\"],[9,\"class\",\"table table-bordered table-striped\"],[7],[0,\"\\n  \"],[6,\"thead\"],[7],[0,\"\\n  \"],[6,\"tr\"],[7],[0,\"\\n    \"],[6,\"th\"],[9,\"class\",\"vtop wider\"],[7],[0,\"\\n      Author\\n      \"],[6,\"br\"],[7],[8],[6,\"small\"],[9,\"class\",\"small not-bold\"],[7],[0,\"(Click on the name for editing)\"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"th\"],[7],[0,\"\\n      Title\\n      \"],[6,\"br\"],[7],[8],[6,\"small\"],[9,\"class\",\"small not-bold\"],[7],[0,\"(Click on the title for editing)\"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"th\"],[9,\"class\",\"vtop\"],[7],[0,\"Release Year\"],[8],[0,\"\\n    \"],[6,\"th\"],[9,\"class\",\"vtop\"],[7],[0,\"\\n      Library\\n      \"],[6,\"br\"],[7],[8],[6,\"small\"],[9,\"class\",\"small not-bold\"],[7],[0,\"(Click on the name for editing)\"],[8],[0,\"    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[0,\"    \"],[6,\"tr\"],[7],[0,\"\\n\\n      \"],[6,\"td\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isAuthorEditing\"]]],null,{\"statements\":[[0,\"\\n          \"],[1,[25,\"author-select\",null,[[\"book\",\"authors\",\"default\",\"action\"],[[19,1,[]],[19,0,[\"authors\"]],[19,1,[\"author\"]],\"saveAuthor\"]]],false],[0,\"\\n\\n          \"],[6,\"button\"],[9,\"class\",\"btn btn-danger\"],[3,\"action\",[[19,0,[]],\"cancelAuthorEdit\",[19,1,[]]]],[7],[0,\"Cancel\"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"          \"],[6,\"span\"],[3,\"action\",[[19,0,[]],\"editAuthor\",[19,1,[]]]],[7],[1,[19,1,[\"author\",\"name\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"      \"],[8],[0,\"\\n\\n      \"],[6,\"td\"],[7],[0,\"\\n\"],[4,\"if\",[[19,1,[\"isEditing\"]]],null,{\"statements\":[[0,\"          \"],[6,\"form\"],[9,\"class\",\"form-inline\"],[3,\"action\",[[19,0,[]],\"saveBook\",[19,1,[]]],[[\"on\"],[\"submit\"]]],[7],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"input-group\"],[7],[0,\"\\n              \"],[1,[25,\"input\",null,[[\"value\",\"class\"],[[19,1,[\"title\"]],\"form-control\"]]],false],[0,\"\\n              \"],[6,\"div\"],[9,\"class\",\"input-group-btn\"],[7],[0,\"\\n                \"],[6,\"button\"],[9,\"type\",\"submit\"],[9,\"class\",\"btn btn-success\"],[10,\"disabled\",[19,1,[\"isNotValid\"]],null],[7],[0,\"Save\"],[8],[0,\"\\n                \"],[6,\"button\"],[9,\"class\",\"btn btn-danger\"],[3,\"action\",[[19,0,[]],\"cancelBookEdit\",[19,1,[]]]],[7],[0,\"Cancel\"],[8],[0,\"\\n              \"],[8],[0,\"\\n            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"          \"],[6,\"span\"],[3,\"action\",[[19,0,[]],\"editBook\",[19,1,[]]]],[7],[1,[19,1,[\"title\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"      \"],[8],[0,\"\\n\\n      \"],[6,\"td\"],[7],[1,[19,1,[\"releaseYear\"]],false],[8],[0,\"\\n      \"],[6,\"td\"],[7],[0,\"\\n\\n\"],[4,\"if\",[[19,1,[\"isLibraryEditing\"]]],null,{\"statements\":[[0,\"\\n          \"],[1,[25,\"library-select\",null,[[\"book\",\"libraries\",\"default\",\"action\"],[[19,1,[]],[19,0,[\"libraries\"]],[19,1,[\"library\"]],\"saveLibrary\"]]],false],[0,\"\\n\\n          \"],[6,\"button\"],[9,\"class\",\"btn btn-danger\"],[3,\"action\",[[19,0,[]],\"cancelLibraryEdit\",[19,1,[]]]],[7],[0,\"Cancel\"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"          \"],[6,\"span\"],[3,\"action\",[[19,0,[]],\"editLibrary\",[19,1,[]]]],[7],[1,[19,1,[\"library\",\"name\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/books.hbs" } });
});
define("library-app/templates/components/fader-label", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "klBl68u4", "block": "{\"symbols\":[\"&default\"],\"statements\":[[2,\" app/templates/components/fader-label.hbs \"],[0,\"\\n\"],[11,1]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/components/fader-label.hbs" } });
});
define("library-app/templates/components/library-item-form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ccTf+COy", "block": "{\"symbols\":[],\"statements\":[[2,\" app/templates/components/library-item-form.hbs \"],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"form-horizontal\"],[7],[0,\"\\n  \"],[6,\"div\"],[10,\"class\",[26,[\"form-group has-feedback \",[25,\"if\",[[19,0,[\"item\",\"isValid\"]],\"has-success\"],null]]]],[7],[0,\"\\n    \"],[6,\"label\"],[9,\"class\",\"col-sm-2 control-label\"],[7],[0,\"Name\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-sm-10\"],[7],[0,\"\\n      \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[19,0,[\"item\",\"name\"]],\"form-control\",\"The name of the Library\"]]],false],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n    \"],[6,\"label\"],[9,\"class\",\"col-sm-2 control-label\"],[7],[0,\"Address\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-sm-10\"],[7],[0,\"\\n      \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[19,0,[\"item\",\"address\"]],\"form-control\",\"The address of the Library\"]]],false],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n    \"],[6,\"label\"],[9,\"class\",\"col-sm-2 control-label\"],[7],[0,\"Phone\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-sm-10\"],[7],[0,\"\\n      \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[19,0,[\"item\",\"phone\"]],\"form-control\",\"The phone number of the Library\"]]],false],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-sm-offset-2 col-sm-10\"],[7],[0,\"\\n      \"],[6,\"button\"],[9,\"type\",\"submit\"],[9,\"class\",\"btn btn-default\"],[10,\"disabled\",[25,\"unless\",[[19,0,[\"item\",\"isValid\"]],true],null],null],[3,\"action\",[[19,0,[]],\"buttonClicked\",[19,0,[\"item\"]]]],[7],[1,[18,\"buttonLabel\"],false],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/components/library-item-form.hbs" } });
});
define("library-app/templates/components/library-item", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "D++qOQnF", "block": "{\"symbols\":[\"&default\"],\"statements\":[[6,\"div\"],[9,\"class\",\"panel panel-default library-item\"],[7],[0,\"\\n\\n    \"],[6,\"div\"],[9,\"class\",\"panel-heading\"],[7],[0,\"\\n        \"],[6,\"h3\"],[9,\"class\",\"panel-title\"],[7],[1,[20,[\"item\",\"name\"]],false],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"panel-body\"],[7],[0,\"\\n        \"],[6,\"p\"],[7],[0,\"Address: \"],[1,[20,[\"item\",\"address\"]],false],[8],[0,\"\\n        \"],[6,\"p\"],[7],[0,\"Phone: \"],[1,[20,[\"item\",\"phone\"]],false],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"panel-footer text-right\"],[7],[0,\"\\n        \"],[11,1],[0,\"\\n    \"],[8],[0,\"\\n\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/components/library-item.hbs" } });
});
define("library-app/templates/components/nav-link-to", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ZJmM75rg", "block": "{\"symbols\":[\"&default\"],\"statements\":[[2,\" app/templates/components/nav-link-to.hbs \"],[0,\"\\n\"],[6,\"a\"],[9,\"href\",\"\"],[7],[11,1],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/components/nav-link-to.hbs" } });
});
define("library-app/templates/components/number-box", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "sHr+2zBq", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"panel-heading\"],[7],[0,\"\\n\\n    \"],[6,\"h3\"],[9,\"class\",\"text-center\"],[7],[1,[18,\"title\"],false],[8],[0,\"\\n    \"],[2,\" se for passado um numero escreve um numero, caso contrario tres pontinhos \"],[0,\"\\n    \"],[6,\"h1\"],[9,\"class\",\"text-center\"],[7],[1,[25,\"if\",[[19,0,[\"number\"]],[19,0,[\"number\"]],\"...\"],null],false],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/components/number-box.hbs" } });
});
define("library-app/templates/components/seeder-block", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "b7ZouAQv", "block": "{\"symbols\":[],\"statements\":[[2,\" app/templates/components/seeder-block.hbs \"],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"well well-sm extra-padding-bottom\"],[7],[0,\"\\n  \"],[6,\"h3\"],[7],[1,[18,\"sectionTitle\"],false],[8],[0,\"\\n  \\n  \"],[6,\"div\"],[9,\"class\",\"form-inline\"],[7],[0,\"\\n  \\n   \"],[6,\"div\"],[10,\"class\",[26,[\"form-group has-feedback \",[25,\"unless\",[[19,0,[\"isCounterValid\"]],\"has-error\"],null]]]],[7],[0,\"\\n     \"],[6,\"label\"],[9,\"class\",\"control-label\"],[7],[0,\"Number of new records:\"],[8],[0,\"\\n     \"],[1,[25,\"input\",null,[[\"value\",\"class\",\"placeholder\"],[[19,0,[\"counter\"]],\"form-control\",[19,0,[\"placeholder\"]]]]],false],[0,\"\\n   \"],[8],[0,\"\\n  \\n   \"],[6,\"button\"],[9,\"class\",\"btn btn-primary\"],[10,\"disabled\",[18,\"generateIsDisabled\"],null],[3,\"action\",[[19,0,[]],\"generateAction\"]],[7],[0,\"\\n\"],[4,\"if\",[[19,0,[\"generateInProgress\"]]],null,{\"statements\":[[0,\"       \"],[6,\"span\"],[9,\"class\",\"glyphicon glyphicon-refresh spinning\"],[7],[8],[0,\" Generating...\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"       Generate \"],[1,[18,\"sectionTitle\"],false],[0,\"\\n\"]],\"parameters\":[]}],[0,\"   \"],[8],[0,\"\\n   \"],[4,\"fader-label\",null,[[\"isShowing\"],[[19,0,[\"generateReady\"]]]],{\"statements\":[[0,\"Created!\"]],\"parameters\":[]},null],[0,\"\\n  \\n   \"],[6,\"button\"],[9,\"class\",\"btn btn-danger\"],[10,\"disabled\",[18,\"deleteIsDisabled\"],null],[3,\"action\",[[19,0,[]],\"deleteAction\"]],[7],[0,\"\\n\"],[4,\"if\",[[19,0,[\"deleteInProgress\"]]],null,{\"statements\":[[0,\"       \"],[6,\"span\"],[9,\"class\",\"glyphicon glyphicon-refresh spinning\"],[7],[8],[0,\" Deleting...\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"       Delete All \"],[1,[18,\"sectionTitle\"],false],[0,\"\\n\"]],\"parameters\":[]}],[0,\"   \"],[8],[0,\"\\n   \"],[4,\"fader-label\",null,[[\"isShowing\"],[[19,0,[\"deleteReady\"]]]],{\"statements\":[[0,\"Deleted!\"]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/components/seeder-block.hbs" } });
});
define("library-app/templates/contact", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "pzv6oKvT", "block": "{\"symbols\":[],\"statements\":[[6,\"h1\"],[7],[0,\"Contact Page\"],[8],[0,\"\\n\\n\"],[6,\"p\"],[9,\"class\",\"well well-sm\"],[7],[0,\"\\n    If you have any question or feedback please leave a message with your email address.\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-md-6\"],[7],[0,\"\\n\\n\"],[4,\"if\",[[19,0,[\"responseSendEmail\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"col-md-6\"],[7],[0,\"\\n            \"],[6,\"br\"],[7],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"alert alert-success\"],[7],[0,\"\\n                \"],[6,\"h4\"],[7],[0,\"Thank You ! Your message is sent.\"],[8],[0,\"\\n                \"],[1,[18,\"responseSendEmail\"],false],[0,\"\\n                \"],[6,\"p\"],[7],[0,\"To: \"],[1,[20,[\"model\",\"email\"]],false],[8],[0,\"\\n                \"],[6,\"p\"],[7],[0,\"Message: \"],[1,[20,[\"model\",\"message\"]],false],[8],[0,\"\\n                \"],[6,\"p\"],[7],[0,\"Reference ID: \"],[1,[20,[\"model\",\"id\"]],false],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\n        \"],[6,\"div\"],[10,\"class\",[26,[\"form-group has-feedback \",[25,\"if\",[[19,0,[\"model\",\"isValidEmail\"]],\"has-success\"],null]]]],[7],[0,\"\\n            \"],[6,\"label\"],[7],[0,\"Your email Address*:\"],[8],[0,\" \\n            \"],[1,[25,\"input\",null,[[\"type\",\"class\",\"placeholder\",\"value\",\"autofocus\"],[\"email\",\"form-control\",\"Your email address\",[19,0,[\"model\",\"email\"]],\"autofocus\"]]],false],[0,\"\\n\"],[4,\"if\",[[19,0,[\"model\",\"isValidEmail\"]]],null,{\"statements\":[[0,\"                \"],[6,\"span\"],[9,\"class\",\"glyphicon glyphicon-ok form-control-feedback\"],[9,\"aria-hidden\",\"true\"],[7],[8],[0,\"\\n                \"],[6,\"span\"],[9,\"id\",\"inputSuccess2Status\"],[9,\"class\",\"sr-only\"],[7],[0,\"(success)\"],[8],[0,\" \\n\"]],\"parameters\":[]},null],[0,\"        \"],[8],[0,\"\\n\\n        \"],[6,\"div\"],[10,\"class\",[26,[\"form-group has-feedback \",[25,\"if\",[[19,0,[\"model\",\"hasEnoughText\"]],\"has-success\"],null]]]],[7],[0,\"\\n            \"],[6,\"label\"],[7],[0,\"Your Message*:\"],[8],[0,\" \\n            \"],[1,[25,\"textarea\",null,[[\"class\",\"placeholder\",\"rows\",\"value\"],[\"form-control\",\"Your message. (At least 5 characters.)\",\"7\",[19,0,[\"model\",\"message\"]]]]],false],[0,\" \\n            \\n\"],[4,\"if\",[[19,0,[\"model\",\"hasEnoughText\"]]],null,{\"statements\":[[0,\"                \"],[6,\"span\"],[9,\"class\",\"glyphicon glyphicon-ok form-control-feedback\"],[9,\"aria-hidden\",\"true\"],[7],[8],[0,\"\\n                \"],[6,\"span\"],[9,\"id\",\"inputSuccess2Status\"],[9,\"class\",\"sr-only\"],[7],[0,\"(success)\"],[8],[0,\" \\n\"]],\"parameters\":[]},null],[0,\"        \"],[8],[0,\"\\n        \"],[6,\"button\"],[9,\"class\",\"btn btn-success\"],[10,\"disabled\",[20,[\"model\",\"isNotValid\"]],null],[3,\"action\",[[19,0,[]],\"sendEmail\",[19,0,[\"model\"]]]],[7],[0,\"Send\"],[8],[0,\" \"]],\"parameters\":[]}],[0,\"\\n\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/contact.hbs" } });
});
define("library-app/templates/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "PGe2EMoI", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"jumotron text-center\"],[7],[0,\"\\n\\n    \"],[6,\"h1\"],[7],[0,\"Coming Soon\"],[8],[0,\"\\n\\n    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\\n    \"],[6,\"p\"],[7],[0,\"\\n        Don't miss our launch date, request an invitation now.\\n    \"],[8],[0,\"\\n\\n\\n    \"],[6,\"div\"],[9,\"class\",\"form-horizontal form-group form-group-lg row\"],[7],[0,\"\\n        \\n        \"],[6,\"div\"],[9,\"class\",\"col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-1 col-md-5 col-md-offset-2\"],[7],[0,\"\\n            \"],[2,\"\\n            <input type=\\\"email\\\" class=\\\"form-control\\\" placeholder=\\\"Please type your e-mail address.\\\" autofocus=\\\"autofocus\\\" />\\n            \"],[0,\"\\n            \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"class\",\"placeholder\",\"autofocus\"],[\"email\",[19,0,[\"emailAddress\"]],\"form-control\",\"Please type your e-mail address.\",\"autofocus\"]]],false],[0,\"\\n        \"],[8],[0,\"\\n        \\n        \"],[6,\"div\"],[9,\"class\",\"col-xs-10 col-xs-offset-1 col-sm-offset-0 col-sm-4 col-md-3\"],[7],[0,\"\\n            \"],[6,\"button\"],[10,\"disabled\",[18,\"isDisabled\"],null],[9,\"class\",\"btn btn-primary btn-lg btn-block\"],[3,\"action\",[[19,0,[]],\"saveInvitation\"]],[7],[0,\"Request invitation\"],[8],[0,\"\\n        \"],[8],[0,\"\\n    \\n    \"],[8],[0,\"\\n\"],[4,\"if\",[[19,0,[\"responseMessage\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"alert alert-success\"],[7],[0,\"\\n            \"],[1,[18,\"responseMessage\"],false],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[6,\"br\"],[7],[8],[6,\"br\"],[7],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/index.hbs" } });
});
define("library-app/templates/libraries", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "in8HtRi/", "block": "{\"symbols\":[],\"statements\":[[2,\" app/templates/libraries.hbs \"],[0,\"\\n\"],[6,\"h1\"],[7],[0,\"Libraries\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"well\"],[7],[0,\"\\n  \"],[6,\"ul\"],[9,\"class\",\"nav nav-pills\"],[7],[0,\"\\n    \"],[4,\"link-to\",[\"libraries.index\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[6,\"a\"],[9,\"href\",\"\"],[7],[0,\"List all\"],[8]],\"parameters\":[]},null],[0,\"\\n    \"],[4,\"link-to\",[\"libraries.new\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[6,\"a\"],[9,\"href\",\"\"],[7],[0,\"Add new\"],[8]],\"parameters\":[]},null],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[2,\" Aqui renderizará o conteudo de libraries/index.hbs \"],[0,\" \\n\"],[1,[18,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/libraries.hbs" } });
});
define("library-app/templates/libraries/edit", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "HNtYfSDB", "block": "{\"symbols\":[],\"statements\":[[2,\" app/templates/libraries/new.hbs \"],[0,\"\\n\"],[2,\"\\n<h2>Edit Library</h2>\\n\\n<div class=\\\"form-horizontal\\\">\\n  <div class=\\\"form-group\\\">\\n    <label class=\\\"col-sm-2 control-label\\\">Name</label>\\n    <div class=\\\"col-sm-10\\\">\\n      {{input type=\\\"text\\\" value=model.name class=\\\"form-control\\\" placeholder=\\\"The name of the Library\\\"}}\\n    </div>\\n  </div>\\n  <div class=\\\"form-group\\\">\\n    <label class=\\\"col-sm-2 control-label\\\">Address</label>\\n    <div class=\\\"col-sm-10\\\">\\n      {{input type=\\\"text\\\" value=model.address class=\\\"form-control\\\" placeholder=\\\"The address of the Library\\\"}}\\n    </div>\\n  </div>\\n  <div class=\\\"form-group\\\">\\n    <label class=\\\"col-sm-2 control-label\\\">Phone</label>\\n    <div class=\\\"col-sm-10\\\">\\n      {{input type=\\\"text\\\" value=model.phone class=\\\"form-control\\\" placeholder=\\\"The phone number of the Library\\\"}}\\n    </div>\\n  </div>\\n  <div class=\\\"form-group\\\">\\n    <div class=\\\"col-sm-offset-2 col-sm-10\\\">\\n      <button type=\\\"submit\\\" class=\\\"btn btn-default\\\" {{action 'saveLibrary' model}}>Save Changes</button>\\n    </div>\\n  </div>\\n</div>\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/libraries/edit.hbs" } });
});
define("library-app/templates/libraries/form", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "gNN6vtoG", "block": "{\"symbols\":[],\"statements\":[[2,\" app/templates/libraries/form.hbs \"],[0,\"\\n\"],[2,\" Esse é um template q substui o new.hbs e o edit pois serem muito paraceidos.\\nA unica coisa q muda em ambos é o titulo e o label do botão.\\na route/new.js e o route/edit.js fazem a alteracão desse itens \\n\"],[0,\"\\n\"],[6,\"h2\"],[7],[1,[18,\"title\"],false],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n\\n  \"],[6,\"div\"],[9,\"class\",\"col-md-6\"],[7],[0,\"\\n    \"],[2,\" Faz uso de um outro template de fomulario que fica  esquerda da tela\"],[0,\"\\n    \"],[1,[25,\"library-item-form\",null,[[\"item\",\"buttonLabel\",\"action\"],[[19,0,[\"model\"]],[19,0,[\"buttonLabel\"]],\"saveLibrary\"]]],false],[0,\"    \\n  \"],[8],[0,\"\\n\\n  \"],[6,\"div\"],[9,\"class\",\"col-md-4\"],[7],[0,\"\\n    \"],[2,\" Faz uso de um outro template que é um card q recebe as informações do fomulário dicamicamente \"],[0,\"\\n\"],[4,\"library-item\",null,[[\"item\"],[[19,0,[\"model\"]]]],{\"statements\":[[0,\"      \"],[6,\"br\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/libraries/form.hbs" } });
});
define("library-app/templates/libraries/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ddDV3qJO", "block": "{\"symbols\":[\"library\"],\"statements\":[[2,\" app/templates/libraries/index.hbs \"],[0,\"\\n\"],[6,\"h2\"],[7],[0,\"List\"],[8],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"col-md-4\"],[7],[0,\"\\n\"],[4,\"library-item\",null,[[\"item\"],[[19,1,[]]]],{\"statements\":[[0,\"      \"],[4,\"link-to\",[\"libraries.edit\",[19,1,[\"id\"]]],[[\"class\"],[\"btn btn success btn-xs\"]],{\"statements\":[[0,\"Edit\"]],\"parameters\":[]},null],[0,\"\\n      \"],[6,\"button\"],[9,\"class\",\"btn btn-danger btn-xs\"],[3,\"action\",[[19,0,[]],\"deleteLibrary\",[19,1,[]]]],[7],[0,\"Delete\"],[8],[0,\" \\n\"]],\"parameters\":[]},null],[0,\"  \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[8],[0,\"\\n\\n\\n\"],[2,\"\\n<div class=\\\"row\\\">\\n\\n{{#each model as |library|}}\\n\\n  <div class=\\\"col-md-4\\\">\\n\\n    <div class=\\\"panel panel-default library-item\\\">\\n\\n      <div class=\\\"panel-heading\\\">\\n        <h3 class=\\\"panel-title\\\">{{library.name}}</h3>\\n      </div>\\n      <div class=\\\"panel-body\\\">\\n        <p>Address: {{library.address}}</p>\\n        <p>Phone: {{library.phone}}</p>\\n      </div>\\n\\n      <div class=\\\"panel-footer text-right\\\">\\n        {{#link-to \\\"libraries.edit\\\" library.id class=\\\"btn btn success btn-xs\\\" }}Edit{{/link-to}}\\n        <button class=\\\"btn btn-danger btn-xs\\\" {{ action 'deleteLibrary' library }}>Delete</button>\\n      </div>\\n\\n    </div>\\n\\n  </div>\\n\\n  {{/each}}\\n</div>\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/libraries/index.hbs" } });
});
define("library-app/templates/libraries/new", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "o45O5giu", "block": "{\"symbols\":[],\"statements\":[[2,\" app/templates/libraries/new.hbs \"],[0,\"\\n\"],[2,\"\\n<h2>Add a new local Library</h2>\\n\\n<div class=\\\"row\\\">\\n\\n  <div class=\\\"col-md-6\\\">\\n    {{library-item-form item=model buttonLabel=\\\"Add to library list\\\" action=\\\"saveLibrary\\\"}}    \\n  </div>\\n\\n  <div class=\\\"col-md-4\\\">\\n{{#library-item item=model}}\\n      <br/>\\n    {{/library-item}}  </div>\\n</div>\\n\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/libraries/new.hbs" } });
});
define("library-app/templates/navbar", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "0msKLEis", "block": "{\"symbols\":[],\"statements\":[[2,\" app/templates/navbar.hbs \"],[0,\"\\n\"],[6,\"nav\"],[9,\"class\",\"navbar navbar-inverse\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container-fluid\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"navbar-header\"],[7],[0,\"\\n            \"],[6,\"button\"],[9,\"type\",\"button\"],[9,\"class\",\"navbar-toggle collapsed\"],[9,\"data-toggle\",\"collapse\"],[9,\"data-target\",\"#main-navbar\"],[7],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"sr-only\"],[7],[0,\"Toggle navigation\"],[8],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"icon-bar\"],[7],[8],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"icon-bar\"],[7],[8],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"icon-bar\"],[7],[8],[0,\"\\n            \"],[8],[0,\" \"],[4,\"link-to\",[\"index\"],[[\"class\"],[\"navbar-brand\"]],{\"statements\":[[0,\"Library App\"]],\"parameters\":[]},null],[0,\"\\n        \"],[8],[0,\"\\n\\n        \"],[6,\"div\"],[9,\"class\",\"collapse navbar-collapse\"],[9,\"id\",\"main-navbar\"],[7],[0,\"\\n            \"],[6,\"ul\"],[9,\"class\",\"nav navbar-nav\"],[7],[0,\"\\n                \"],[4,\"nav-link-to\",[\"index\"],null,{\"statements\":[[0,\"Home\"]],\"parameters\":[]},null],[0,\" \\n                \"],[4,\"nav-link-to\",[\"libraries\"],null,{\"statements\":[[0,\"Libraries\"]],\"parameters\":[]},null],[0,\"\\n                \"],[4,\"nav-link-to\",[\"authors\"],null,{\"statements\":[[0,\"Authors\"]],\"parameters\":[]},null],[0,\"\\n                \"],[4,\"nav-link-to\",[\"books\"],null,{\"statements\":[[0,\"Books\"]],\"parameters\":[]},null],[0,\" \\n                \\n            \"],[8],[0,\"\\n\\n            \"],[6,\"ul\"],[9,\"class\",\"nav navbar-nav navbar-right\"],[7],[0,\"\\n                \"],[4,\"nav-link-to\",[\"about\"],null,{\"statements\":[[0,\"About\"]],\"parameters\":[]},null],[0,\"\\n                \"],[4,\"nav-link-to\",[\"contact\"],null,{\"statements\":[[0,\"Contact\"]],\"parameters\":[]},null],[0,\"\\n                \"],[6,\"li\"],[9,\"class\",\"dropdown\"],[7],[0,\"\\n                    \"],[6,\"a\"],[9,\"class\",\"dropdown-toggle\"],[9,\"data-toggle\",\"dropdown\"],[9,\"role\",\"button\"],[9,\"aria-haspopup\",\"true\"],[9,\"aria-expanded\",\"false\"],[7],[0,\"\\n                            Admin\\n                            \"],[6,\"span\"],[9,\"class\",\"caret\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[6,\"ul\"],[9,\"class\",\"dropdown-menu\"],[7],[0,\"\\n                        \"],[4,\"nav-link-to\",[\"admin.invitations\"],null,{\"statements\":[[0,\"Invitations\"]],\"parameters\":[]},null],[0,\" \\n                        \"],[4,\"nav-link-to\",[\"admin.contacts\"],null,{\"statements\":[[0,\"Contacts\"]],\"parameters\":[]},null],[0,\"\\n                        \"],[4,\"nav-link-to\",[\"admin.seeder\"],null,{\"statements\":[[0,\"Seeder\"]],\"parameters\":[]},null],[0,\"\\n                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[2,\" end menu dropdown \"],[0,\"\\n        \"],[8],[0,\"\\n        \"],[2,\" /.navbar-collapse \"],[0,\"\\n    \"],[8],[0,\"\\n    \"],[2,\" /.container-fluid \"],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/navbar.hbs" } });
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
  require("library-app/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_TRANSITIONS":true,"LOG_TRANSITIONS_INTERNAL":true,"LOG_VIEW_LOOKUPS":true,"name":"library-app","version":"0.0.0+f8868e46"});
}
//# sourceMappingURL=library-app.map
