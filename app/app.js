"use strict";
var angular = require('angular');

(function () {

    var app = angular.module('newsHunter', []);

    var getRandomCategory = function (categories) {
        if (angular.isArray(categories)) {
            return categories[Math.floor(Math.random() * categories.length)];
        }
        return null;
    };

    app.controller('SidebarController', function () {

        this.categories = [
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
        ];

    });

    app.controller('NewsController', ['$http', function ($http) {

        var news = this;

        this.category = getRandomCategory(this.categories);
        this.url = 'http://rss.news.yahoo.com/rss/' + this.category;

        $http({
            url: 'https://query.yahooapis.com/v1/public/yql',
            method: 'GET',
            params: {
                'q': "select * from rss where url='" + this.url + "'",
                'format': "json"
            }
        }).success(function (data) {
            console.log(data);
//            news.stories = data.query.results.item;
        });
    }]);

    app.filter('renderHTMLCorrectly', function ($sce) {
        return function (stringToParse) {
            return $sce.trustAsHtml(stringToParse);
        };
    });

})();