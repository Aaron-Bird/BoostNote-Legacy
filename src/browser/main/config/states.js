/* global angular */
angular.module('codexen')
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push(function ($q, $injector) {
      return {
        responseError: function (res) {
          switch (res.status) {
            case 401:
              var $state = $injector.get('$state')
              $state.go('auth.signin')
              break
          }

          return $q.reject(res)
        }
      }
    })

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

      .state('settings', {
        url: '/settings',
        views: {
          'main-view': {
            templateUrl: 'tpls/states/settings.tpl.html',
            controller: 'SettingsController as vm'
          }
        }
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
            return Snippet.findMine().then(function (res) {
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

      /* Recipes */
      .state('recipes', {
        url: '/recipes',
        views: {
          'main-view': {
            templateUrl: 'tpls/states/recipes.list.tpl.html',
            controller: 'RecipesListController as vm'
          }
        },
        resolve: {
          myRecipes: function (Recipe) {
            return Recipe.findMine().then(function (res) {
              return res.data
            })
          }
        }
      })
      .state('recipes.detail', {
        url: '/:id',
        templateUrl: 'tpls/states/recipes.detail.html',
        controller: 'RecipesDetailController as vm'
      })
  })
