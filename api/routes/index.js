const router = require('koa-router')()


var wx = require('../controller/wx');



module.exports = function routes(app) {

    app.post('/wx', wx.getUserInfo); //微信获取用户信息

    app.post('/tryCreateOdooUser', wx.tryCreateOdooUser); //微信获取用户信息

    app.post('/test', wx.test); //微信获取用户信息

}