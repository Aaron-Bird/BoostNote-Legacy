/* global angular */
angular.module('codexen.states')
  .config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider
      .when('/auth', '/auth/register')
      .when('/auth/', '/auth/register')

    $stateProvider
      /* Auth */
      .state('auth', {
        url: '/auth',
        views:{
          'main-view': {
            templateUrl: 'states/auth/auth.tpl.html'
          }
        }
      })
      .state('auth.register', {
        url: '/register',
        templateUrl: 'states/auth/register.tpl.html',
        controller: 'AuthRegisterController as vm'
      })
      .state('auth.signin', {
        url: '/signin',
        templateUrl: 'states/auth/signin.tpl.html',
        controller: 'AuthSignInController as vm'
      })

      /* Home */
      .state('home', {
        url: '/',
        views:{
          'main-view': {
            templateUrl: 'states/home/home.tpl.html',
            controller: 'HomeController as vm'
          }
        }
      })

  })
