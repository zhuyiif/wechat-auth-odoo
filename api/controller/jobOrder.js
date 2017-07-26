const Odoo = require('odoo-connect')
const odoo = new Odoo({
    host: 'http://vh.monitor.cq-tct.com/',
    port: 80
});

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
            return client.searchRead('jo.task', [], { limit: 100, select: ['ccSend', 'fileID', 'progress', 'mainSend', 'prority', 'title', 'url'] });
        }).then(calendarEvent => {
            console.log("read jo.task")
            console.log(calendarEvent);
            resolve(calendarEvent);
        }, (error) => {
            console.log("err " + error);
            reject(error);
        });
    })
};

const getOrder = async(ctx) => {
    let calendarEvent = await connect("119.29.187.201", 8071, "demo1", "demo", "123456");
    ctx.body = {
        res: calendarEvent
    }
}

module.exports = {
    getOrder
}