"use strict";
var angular = require('angular');

(function () {

    var app = angular.module('newsHunter', ['ngRoute', 'angularSpinner']);

    // Filters
    app.filter('rawHtml', ['$sce', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    }]);
    
    // Config
    
    app.config(['$routeProvider', 'usSpinnerConfigProvider', function ($routeProvider, usSpinnerConfigProvider) {
        $routeProvider.
        when('/:category', {
            templateUrl: 'news.html',
            controller: 'NewsCtrl'
        }).
        otherwise({
            redirectTo: '/topstories'
        });
        usSpinnerConfigProvider.setDefaults({
            color: 'black'
        });
    }]);

    // Directives
    app.directive('sidebar', function () {
        return {
            restrict: 'E',
            templateUrl: 'sidebar.html'
        };
    });

    app.factory('YahooNewsService', function ($http) {

        function _getNewsForCategory(category) {
            return $http({
                url: 'https://query.yahooapis.com/v1/public/yql',
                method: 'GET',
                params: {
                    'q': "select * from rss where url='http://rss.news.yahoo.com/rss/" + category + "'",
                    'format': "json"
                }
            }).
            then(function (response) {
                return response.data;
            });
        }

        return {
            getNewsForCategory: _getNewsForCategory
        };

    });

    // Services
    app.factory('CategoryService', function () {
        return {
            list: [
                'africa',
                'asia',
                'celebrity',
                'europe',
                'fashion',
                'health',
                'movies',
                'music',
                'politics',
                'science',
                'sports',
                'stocks',
                'tech',
                'topstories',
                'travel',
                'tv',
                'us',
                'weather',
                'world'
            ]
        };
    });

    // Controllers
    app.controller('SidebarCtrl', ['CategoryService', function (CategoryService) {
        this.categories = CategoryService.list;
    }]);

    app.controller('NewsCtrl', ['$scope', '$routeParams', 'YahooNewsService', 'usSpinnerService', function ($scope, $routeParams, YahooNewsService, usSpinnerService) {
        this.category = $routeParams.category;
        var ctrl = this;
        YahooNewsService.getNewsForCategory($routeParams.category).
        then(function (data) {
            ctrl.news = data.query.results.item;
            usSpinnerService.stop('loading-news-spinner');
        });
    }]);

})();