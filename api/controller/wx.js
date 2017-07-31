'use strict';

var rp = require('request-promise');
var redis = require('../redis');
var config = {
    CorpID: 'wwbf94872d6daf233a',
    Secret: '_syC0GQEokKuUwVfTUS3hbyGQKnMx5sZUREtt-svrhY'
}


var invoke = function*(method, uri, qs, body) {
    var result = yield rp({
        method: method,
        uri: uri,
        qs: qs,
        body: body,
        headers: {
            'Content-Type': 'application/json',
            'cache-control': 'no-cache'
        },
        json: true
    });
    return result;
}

var getToken = function*() {
    var token = yield redis.get('wechatauth-token');
    console.log("token3 = " + token);
    if (token && typeof(token) != "undefined" && token != "undefined") {
        console.log("token3= " + token == "undefined");
        console.log("token4 len = " + token.length);
        return token;
    } else {
        var uri = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${config.CorpID}&corpsecret=${config.Secret}`;

        console.log("uri = " + uri);
        var newToken = yield invoke('GET', uri, null, null);
        console.log("newToken = " + token);
        yield redis.set('wechatauth-token', newToken.access_token);
        yield redis.expire('wechatauth-token', 7000);
        return newToken.access_token;
    }
}

var getDepartment = function* getDepartment(id, token) {
    var uri = `https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=${token}&id=${id}`;
    var res = yield invoke('GET', uri)
    var departmentid = res.department[0].parentid;
    if (departmentid != 1) {
        var res = yield getDepartment(departmentid, token)
        return res
    } else {
        return res.department[0].name
    }
}


var getWeChatUserInfo = function*(code) {
    var token = yield getToken();
    console.log("token = " + token);
    var uri = `https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=${token}&code=${code}`;
    var result = yield invoke('GET', uri);
    var userid = result.UserId;
    var userUri = `https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${token}&userid=${userid}`;
    var user = yield invoke('GET', userUri);
    console.log("user = " + JSON.stringify(user));
    console.log("result = " + JSON.stringify(result));
    return user;
}

exports.getUserInfo = function*(ctx) {
    var code = this.request.body.code;
    var user = yield getWeChatUserInfo(code);
    console.log("getUserInfo = " + JSON.stringify(user));
    ctx.body = user;

}




exports.tryCreateOdooUser = function*(ctx) {

    var user = this.request.body.user;

    var res = yield rp({
        method: 'POST',
        uri: 'http://119.29.187.201:12345/web/signup',
        qs: null,
        form: {
            login: user.email,
            password: user.password,
            confirm_password: user.password,
            name: user.name
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        resolveWithFullResponse: true
    });
    ctx.body = res;
}


const Odoo = require('odoo-connect');
let connect = async function(host, port, db, user, password) {
    let _self = this;
    return new Promise((resolve, reject) => {
        const odoo = new Odoo({
            host: host,
            port: port
        });
        odoo.connect({
            database: db,
            username: user,
            password: password
        }).then(client => {
            console.log("connect client")
            return client.searchRead('calendar.event', [], { limit: 100, select: ['display_name', 'display_start', 'stop_date', 'is_attendee', 'duration'] });
        }).then(calendarEvent => {
            console.log("read calendar")
            console.log(calendarEvent);
            resolve(calendarEvent);
        }, (error) => {
            console.log("err " + error);
            reject(error);
        });
    })
};


exports.getEvents = function*(ctx) {

    console.log('ctx' + ctx);

    var calendarEvent = yield connect("vh.monitor.cq-tct.com", 8071, "demo1", "demo", "demo");
    // console.log(calendarEvent);
    this.body = calendarEvent;
}


exports.getEventsWithCode = function*(ctx) {

    console.log('ctx' + ctx);
    var userid = this.request.body.userid;

    console.log('userid' + userid);
    var calendarEvent = yield connect("vh.monitor.cq-tct.com", 8071, "demo1", userid, "123456");
    // console.log(calendarEvent);
    this.body = calendarEvent;

}