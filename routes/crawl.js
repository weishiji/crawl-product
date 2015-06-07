/**
 * Created by lxg on 15-6-7.
 */
var express = require('express');
var router = express.Router();
var db = require('../server/db');

var phantom = require('phantom');

var aliurl = "http://maliangshizhuang.1688.com"
//var aliurl = "http://test.weixueji.com"
var aliulr = 'http://maliangshizhuang.1688.com/page/offerlist.htm?spm=a2615.7691456.0.0.NhtxXP&showType=windows&tradenumFilter=false&sampleFilter=false&mixFilter=false&privateFilter=false&mobileOfferFilter=%24mobileOfferFilter&groupFilter=false&sortType=tradenumdown&pageNum=2#search-bar'

router.get('/app', function (req, res, next) {
    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.open(aliurl, function (status) {
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
