"use strict";
var angular = require('angular');

(function () {

    var app = angular.module('newsHunter', []);

    app.controller('NewsController', ['$http', function ($http) {
        this.stories = [];
        var news = this;
        $http({
            url: 'https://query.yahooapis.com/v1/public/yql',
            method: 'GET',
            params: {
                'q': "select * from rss where url='http://rss.news.yahoo.com/rss/topstories'",
                'format': "json"
            }
        }).success(function (data) {
            news.stories = data.query.results.item;
        });
    }]);

    app.filter('renderHTMLCorrectly', function ($sce) {
        return function (stringToParse) {
            return $sce.trustAsHtml(stringToParse);
        };
    });

})();