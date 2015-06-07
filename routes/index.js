var express = require('express');
var router = express.Router();
var db = require('../server/db');
var async = require('async');
var request = require('request');
var fs = require('fs');
console.log(__dirname)
var jqueryPath = __dirname + '/../node_modules/jquery/dist/jquery.min.js'
var jquery = fs.readFileSync(jqueryPath, "utf-8");
var jsdom = require("node-jsdom");


var Crawler = require("crawler");
var url = require('url');


var phantom = require('phantom');


/* GET home page. */
router.get('/', function (req, res, next) {
    var sess = req.session;
    var user = db.User;
    var chatRoom = db.ChatRoom;
    var resData = {
        'title': '首页', 'loginStatus': sess.user_id ? true : false
    }
    async.parallel({
        'user': function (cb) {
            if (sess.user_id) {
                user.findOne({'_id': sess.user_id}).exec(cb);
            } else {
                cb();
            }
        }, 'rooms': function (cb) {
            chatRoom.find({}).exec(cb)
        }
    }, function (errs, results) {
        if (resData.loginStatus) {
            resData.title = results.user.username;
            resData['user'] = results.user
            resData['user']['password'] = null
            sess.user_id = results.user['_id']
        }
        resData.rooms = results.rooms;

        res.render('index/index', resData)
    })
});

router.get('/about', function (req, res, next) {
    //var session = req.session
    /// var aliurl = 'http://maliangshizhuang.1688.com/page/offerlist.htm?spm=a2615.7691456.0.0.NhtxXP&showType=windows&tradenumFilter=false&sampleFilter=false&mixFilter=false&privateFilter=false&mobileOfferFilter=%24mobileOfferFilter&groupFilter=false&sortType=tradenumdown&pageNum=2#search-bar'
    var aliurl = "http://maliangshizhuang.1688.com"
    //var aliurl = "http://test.weixueji.com/"
    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.open(aliurl, function (status) {
                page.includeJs(jqueryPath,function(){
                    page.evaluate(function () {
                        return document.getElementsByTagName('html')[0].innerHTML
                    }, function (result) {
                        console.log($);
                        ph.exit();
                    });
                })
                //console.log("opened google? ", status);
               /* page.evaluate(function () {
                    return document.getElementsByTagName('html')[0].innerHTML
                }, function (result) {
                    console.log(result);
                    ph.exit();
                });*/
            });
        });
    });


    res.render('index/about', {'htmlStr': 123});

    return

    var c = new Crawler({
        maxConnections: 10,
        // This will be called for each crawled page
        callback: function (error, result, $) {
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log(result.body, '___________________')
            res.render('index/about', {'htmlStr': result.body});
            //$('a').each(function(index, a) {
            //    var toQueueUrl = $(a).attr('href');
            //   c.queue(toQueueUrl);
            //});
        }
    });
    c.queue(aliurl);


    return;
    jsdom.env({
        url: aliurl,
        src: [jquery],
        done: function (errors, window) {
            var $ = window.$
            //console.log($('html').html())
            res.render('index/about', {'htmlStr': $('html').html()})

        }
    });


})

module.exports = router;
