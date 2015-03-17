(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./app/app.js":[function(require,module,exports){
(function (global){
"use strict";
var angular = (typeof window !== "undefined" ? window.angular : typeof global !== "undefined" ? global.angular : null);

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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},["./app/app.js"]);

//# sourceMappingURL=bundle.js.map