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
define('library-app/models/library', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    name: _emberData.default.attr('string'),
    address: _emberData.default.attr('string'),
    phone: _emberData.default.attr('string')
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
    });

    //criando na mão sem ember-cli
    this.route('libraries', function () {
      this.route('new');
    });
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
define('library-app/routes/libraries/index', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = Ember.Route.extend({
        model: function model() {
            return this.store.findAll('library');
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
  exports.default = Ember.HTMLBars.template({ "id": "qaQZHzM9", "block": "{\"symbols\":[],\"statements\":[[1,[18,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/admin/contacts.hbs" } });
});
define("library-app/templates/admin/invitations", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "jHmnA61P", "block": "{\"symbols\":[\"invitation\"],\"statements\":[[2,\" app/templates/admin/invitation.hbs \"],[0,\"\\n\\n\"],[6,\"h1\"],[7],[0,\"invitations\"],[8],[0,\"\\n\\n\"],[6,\"table\"],[9,\"class\",\"table table-bordered table-striped\"],[7],[0,\"\\n\\n    \"],[6,\"thead\"],[7],[0,\"\\n        \"],[6,\"tr\"],[7],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"ID\"],[8],[0,\"\\n            \"],[6,\"th\"],[7],[0,\"E-mail\"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tbody\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[0,\"            \"],[6,\"tr\"],[7],[0,\"\\n                \"],[6,\"th\"],[7],[0,\"\\n                    \"],[1,[19,1,[\"id\"]],false],[0,\"\\n                \"],[8],[0,\"\\n                \"],[6,\"td\"],[7],[0,\"\\n                    \"],[1,[19,1,[\"email\"]],false],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/admin/invitations.hbs" } });
});
define("library-app/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "uj4p/m5d", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"container\"],[7],[0,\"\\n    \"],[12,\"navbar\",[]],[0,\"\\n    \"],[1,[18,\"outlet\"],false],[0,\"\\n\"],[8]],\"hasEval\":true}", "meta": { "moduleName": "library-app/templates/application.hbs" } });
});
define("library-app/templates/contact", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "n7sZuBGs", "block": "{\"symbols\":[],\"statements\":[[6,\"h1\"],[7],[0,\"Contact Page\"],[8],[0,\"\\n\\n\"],[6,\"p\"],[9,\"class\",\"well well-sm\"],[7],[0,\"\\n    If you have any question or feedback please leave a message with your email address.\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"row\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-md-6\"],[7],[0,\"\\n\\n\"],[4,\"if\",[[19,0,[\"responseSendEmail\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"col-md-6\"],[7],[0,\"\\n            \"],[6,\"br\"],[7],[8],[0,\"\\n            \"],[6,\"div\"],[9,\"class\",\"alert alert-success\"],[7],[0,\"\\n                \"],[6,\"h4\"],[7],[0,\"Thank You ! Your message is sent.\"],[8],[0,\"\\n                \"],[1,[18,\"responseSendEmail\"],false],[0,\"\\n                \"],[6,\"p\"],[7],[0,\"To: \"],[1,[20,[\"model\",\"email\"]],false],[8],[0,\"\\n                \"],[6,\"p\"],[7],[0,\"Message: \"],[1,[20,[\"model\",\"message\"]],false],[8],[0,\"\\n                \"],[6,\"p\"],[7],[0,\"Reference ID: \"],[1,[20,[\"model\",\"id\"]],false],[8],[0,\"\\n            \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n            \"],[6,\"label\"],[7],[0,\"Your email Address*:\"],[8],[0,\" \"],[1,[25,\"input\",null,[[\"type\",\"class\",\"placeholder\",\"value\",\"autofocus\"],[\"email\",\"form-control\",\"Your email address\",[19,0,[\"model\",\"email\"]],\"autofocus\"]]],false],[0,\"\\n        \"],[8],[0,\"\\n\\n        \"],[6,\"div\"],[10,\"class\",[26,[\"form-group has-feedback \",[25,\"if\",[[19,0,[\"model\",\"hasEnoughText\"]],\"has-success\"],null]]]],[7],[0,\"\\n            \"],[6,\"label\"],[7],[0,\"Your Message*:\"],[8],[0,\" \"],[1,[25,\"textarea\",null,[[\"class\",\"placeholder\",\"rows\",\"value\"],[\"form-control\",\"Your message. (At least 5 characters.)\",\"7\",[19,0,[\"model\",\"message\"]]]]],false],[0,\" \"],[4,\"if\",[[19,0,[\"model\",\"hasEnoughText\"]]],null,{\"statements\":[[0,\"\\n            \"],[6,\"span\"],[9,\"class\",\"glyphicon glyphicon-ok form-control-feedback\"],[9,\"aria-hidden\",\"true\"],[7],[8],[0,\"\\n            \"],[6,\"span\"],[9,\"id\",\"inputSuccess2Status\"],[9,\"class\",\"sr-only\"],[7],[0,\"(success)\"],[8],[0,\" \"]],\"parameters\":[]},null],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"button\"],[9,\"class\",\"btn btn-success\"],[10,\"disabled\",[20,[\"model\",\"isNotValid\"]],null],[3,\"action\",[[19,0,[]],\"sendEmail\",[19,0,[\"model\"]]]],[7],[0,\"Send\"],[8],[0,\" \"]],\"parameters\":[]}],[0,\"\\n\\n    \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/contact.hbs" } });
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
define("library-app/templates/libraries/index", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "camuyoGl", "block": "{\"symbols\":[\"library\"],\"statements\":[[2,\" app/templates/libraries/index.hbs \"],[0,\"\\n\"],[6,\"h2\"],[7],[0,\"List\"],[8],[0,\"\\n\\n\"],[4,\"each\",[[19,0,[\"model\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"panel panel-default\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"panel-heading\"],[7],[0,\"\\n      \"],[6,\"h3\"],[9,\"class\",\"panel-title\"],[7],[1,[19,1,[\"name\"]],false],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"panel-body\"],[7],[0,\"\\n      \"],[6,\"p\"],[7],[0,\"Address: \"],[1,[19,1,[\"address\"]],false],[8],[0,\"\\n      \"],[6,\"p\"],[7],[0,\"Phone: \"],[1,[19,1,[\"phone\"]],false],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/libraries/index.hbs" } });
});
define("library-app/templates/libraries/new", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "R0TX0XgB", "block": "{\"symbols\":[],\"statements\":[[2,\" app/templates/libraries/new.hbs \"],[0,\"\\n\"],[6,\"h2\"],[7],[0,\"Add a new local Library\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"form-horizontal\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n    \"],[6,\"label\"],[9,\"class\",\"col-sm-2 control-label\"],[7],[0,\"Name\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-sm-10\"],[7],[0,\"\\n      \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[19,0,[\"model\",\"name\"]],\"form-control\",\"The name of the Library\"]]],false],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n    \"],[6,\"label\"],[9,\"class\",\"col-sm-2 control-label\"],[7],[0,\"Address\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-sm-10\"],[7],[0,\"\\n      \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[19,0,[\"model\",\"address\"]],\"form-control\",\"The address of the Library\"]]],false],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n    \"],[6,\"label\"],[9,\"class\",\"col-sm-2 control-label\"],[7],[0,\"Phone\"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-sm-10\"],[7],[0,\"\\n      \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"class\",\"placeholder\"],[\"text\",[19,0,[\"model\",\"phone\"]],\"form-control\",\"The phone number of the Library\"]]],false],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"form-group\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"col-sm-offset-2 col-sm-10\"],[7],[0,\"\\n      \"],[6,\"button\"],[9,\"type\",\"submit\"],[9,\"class\",\"btn btn-default\"],[3,\"action\",[[19,0,[]],\"saveLibrary\",[19,0,[\"model\"]]]],[7],[0,\"Add to library list\"],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/libraries/new.hbs" } });
});
define("library-app/templates/navbar", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Jf7JzAUh", "block": "{\"symbols\":[],\"statements\":[[6,\"nav\"],[9,\"class\",\"navbar navbar-inverse\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"container-fluid\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"navbar-header\"],[7],[0,\"\\n            \"],[6,\"button\"],[9,\"type\",\"button\"],[9,\"class\",\"navbar-toggle collapse\"],[9,\"data-toggle\",\"colalapse\"],[9,\"data-target\",\"#main-navbar\"],[7],[0,\"\\n\\n                \"],[6,\"span\"],[9,\"class\",\"sr-only\"],[7],[0,\"Toggle navigation\"],[8],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"icon-bar\"],[7],[8],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"icon-bar\"],[7],[8],[0,\"\\n                \"],[6,\"span\"],[9,\"class\",\"icon-bar\"],[7],[8],[0,\"\\n\\n            \"],[8],[0,\"\\n\"],[4,\"link-to\",[\"index\"],[[\"class\"],[\"navbar-brand\"]],{\"statements\":[[0,\"                Library App\\n\"]],\"parameters\":[]},null],[0,\"        \"],[8],[0,\"\\n\\n        \"],[6,\"div\"],[9,\"class\",\"collapse navbar-collapse\"],[9,\"id\",\"main-navbar\"],[7],[0,\"\\n            \"],[6,\"ul\"],[9,\"class\",\"nav navbar-nav\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"index\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[0,\"                    \"],[6,\"a\"],[9,\"href\",\"\"],[7],[0,\"Home\"],[8],[0,\"                    \\n\"]],\"parameters\":[]},null],[4,\"link-to\",[\"libraries\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[0,\"                   \"],[6,\"a\"],[9,\"href\",\"\"],[7],[0,\"Libraries\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"link-to\",[\"about\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[0,\"                    \"],[6,\"a\"],[9,\"href\",\"\"],[7],[0,\"About\"],[8],[0,\" \\n\"]],\"parameters\":[]},null],[4,\"link-to\",[\"contact\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[0,\"                    \"],[6,\"a\"],[9,\"href\",\"\"],[7],[0,\"Contact\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                \\n            \"],[8],[0,\"\\n\\n        \"],[6,\"ul\"],[9,\"class\",\"nav navbar-nav navbar-righ\"],[7],[0,\"\\n                \"],[6,\"li\"],[9,\"class\",\"dropdown\"],[7],[0,\"\\n                        \"],[6,\"a\"],[9,\"class\",\"dropdown-toggle\"],[9,\"data-toggle\",\"dropdown\"],[9,\"role\",\"button\"],[9,\"aria-haspopup\",\"true\"],[9,\"aria-expanded\",\"false\"],[7],[0,\"\\n                            Admin\\n                            \"],[6,\"span\"],[9,\"class\",\"caret\"],[7],[8],[0,\"\\n                        \"],[8],[0,\"\\n                    \"],[6,\"ul\"],[9,\"class\",\"dropdown-menu\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"admin.invitations\"],[[\"tagName\"],[\"li\"]],{\"statements\":[[0,\"                            \"],[6,\"a\"],[9,\"href\",\"\"],[7],[0,\"Invitations\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"                    \"],[8],[0,\"\\n                \"],[8],[0,\"\\n            \"],[8],[2,\" end menu dropdown \"],[0,\"\\n        \"],[8],[2,\" /.navbar-collapse \"],[0,\"\\n    \"],[8],[2,\" /.container-fluid \"],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "library-app/templates/navbar.hbs" } });
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
  require("library-app/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_TRANSITIONS":true,"LOG_TRANSITIONS_INTERNAL":true,"LOG_VIEW_LOOKUPS":true,"name":"library-app","version":"0.0.0+f02e7b4c"});
}
//# sourceMappingURL=library-app.map
