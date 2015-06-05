var express = require('express');
var router = express.Router();
var db = require('../server/db');
var async = require('async');
var request = require('request');
var fs = require('fs');
console.log(__dirname)
var jquery = fs.readFileSync(__dirname+'/../node_modules/jquery/dist/jquery.min.js',"utf-8");

var jsdom = require("node-jsdom");
/* GET home page. */
router.get('/', function(req, res, next) {
    var sess = req.session;
    var user = db.User;
    var chatRoom = db.ChatRoom;
    var resData = {
        'title' : '首页'
        ,'loginStatus' : sess.user_id ? true : false
    }
    async.parallel({
        'user' : function(cb){
            if(sess.user_id){
                user.findOne({'_id' : sess.user_id}).exec(cb);
            }else{
                cb();
            }
        }
        ,'rooms' : function(cb){
            chatRoom.find({}).exec(cb)
        }
    },function(errs,results){
        if(resData.loginStatus){
            resData.title = results.user.username;
            resData['user'] = results.user
            resData['user']['password'] = null
            sess.user_id = results.user['_id']
        }
        resData.rooms = results.rooms;

        res.render('index/index',resData)
    })
});

router.get('/about',function(req,res,next){
    //var session = req.session
    jsdom.env({
      url : "http://www.baidu.com",
      src : [jquery],
      done : function (errors, window) {
            var $ = window.$
            console.log($('body').html())
      }
    });
    
    res.render('index/about')

})

module.exports = router;
