const Koa = require('koa');
const path = require('path');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

const convert = require('koa-convert')
const static = require('koa-static')

const {route, allowedMethods} = require('./src/route');
app.use(route);
app.use(allowedMethods);

app.use(convert(static(path.join(__dirname, './dist'))));

app.listen(9003);
