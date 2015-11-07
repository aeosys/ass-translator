angular.module('AssReplacer', [
    'ngRoute',
    'Replacer.FileHandler'
])
    .config([
        '$routeProvider', '$compileProvider',
        function ($routeProvider, $compileProvider) {
        'use strict';
        $routeProvider
            .when('/', {
                controller: 'fileHandlerController',
                templateUrl: '/AssReplacer/filehandler/filehandler.html'
            })
            .otherwise({
                redirectTo: '/'
            });

        if (angular.isDefined($compileProvider.urlSanitizationWhitelist)) {
            $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data|blob):/);
        } else {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|data|blob):/);
        }
    }]);
