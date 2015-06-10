/* global angular */
angular.module('codexen')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .when('/auth', '/auth/register')
      .when('/auth/', '/auth/register')
      .otherwise('/')

    $stateProvider
      /* Auth */
      .state('auth', {
        url: '/auth',
        views: {
          'main-view': {
            templateUrl: 'tpls/states/auth.tpl.html'
          }
        }
      })
      .state('auth.register', {
        url: '/register',
        templateUrl: 'tpls/states/auth.register.tpl.html',
        controller: 'AuthRegisterController as vm'
      })
      .state('auth.signin', {
        url: '/signin',
        templateUrl: 'tpls/states/auth.signin.tpl.html',
        controller: 'AuthSignInController as vm'
      })

      /* Snippets */
      .state('snippets', {
        url: '/snippets',
        views: {
          'main-view': {
            templateUrl: 'tpls/states/snippets.list.tpl.html',
            controller: 'SnippetsListController as vm'
          }
        },
        resolve: {
          mySnippets: function (Snippet) {
            return Snippet.findMine({
              'include': ['Tag']
            }).then(function (res) {
              return res.data
            })
          }
        }
      })
      .state('snippets.detail', {
        url: '/:id',
        templateUrl: 'tpls/states/snippets.detail.tpl.html',
        controller: 'SnippetsDetailController as vm'
      })

      /* Home */
      .state('home', {
        url: '/',
        views: {
          'main-view': {
            templateUrl: 'tpls/states/home.tpl.html',
            controller: 'HomeController as vm'
          }
        }
      })

  })
