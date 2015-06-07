/**
 * Created by lxg on 15-6-7.
 */
var express = require('express');
var router = express.Router();
var db = require('../server/db');

var phantom = require('phantom');


router.get('/app', function (req, res, next) {
    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.open("http://test.weixueji.com", function (status) {
                console.log(status,'++++++++++++++++++++++++++')
                setTimeout(function(){
                    page.evaluate(function () {
                        return document.getElementsByTagName('html')[0].innerHTML
                    }, function (result) {
                        // console.log(result);
                        res.render('crawl/app',{'htmlStr' : result})
                        ph.exit();
                    });
                },2000)

            });
        });
    });


    //res.render('crawl/app',{title : '抓取网页APP'})
});

module.exports = router;
