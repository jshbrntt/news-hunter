"use strict";

var angular = require('angular');

var api_url = 'http://query.yahooapis.com/v1/public/yql';

console.log('test');

//angular.$http.get(api_url, {
//    params: {
//        q: "select * from rss where url='http://news.yahoo.com/rss/topstories'",
//        format: "json",
//        diagnostics: "false"
//    }
//}).
//success(function (data, status, headers, config) {
//    console.debug('success', data, status, headers, config);
//}).
//error(function (data, status, headers, config) {
//    console.debug('error', data, status, headers, config);
//    
//});