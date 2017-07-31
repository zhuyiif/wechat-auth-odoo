var logger = require('koa-logger'),
    json = require('koa-json'),
    onerror = require('koa-onerror');
const favicon = require('koa-favicon')
const Koa = require('koa');
const app = new Koa();

// middlewares
app.use(require('koa-bodyparser')());
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));
const views = require('koa-views');
app.use(views(__dirname + '/views', {
    extension: 'pug'
}));

app.use(function*(next) {
    try {
        yield next;
    } catch (err) {
        console.log(err);
        this.status = err.status || 500;
        this.body = err.message;
        this.app.emit('error', err, this);
    }
});



// routes definition
var routes = require('./routes');
var router = require('koa-router')();
app.use(router.routes());
routes(router);

app.on('error', function(err, ctx) {
    logger.error('server error', err, ctx);
});

module.exports = app;