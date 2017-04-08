const Koa = require('koa');
const path = require('path');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

const convert = require('koa-convert')
const static = require('koa-static')

//跨域
const cors = require('koa2-cors');
app.use(cors({
    credentials: true,
}));


const session = require('koa-session-minimal')
// const redisStore = require('koa-redis')
app.use(session({
  // store: redisStore()
}))

// app.use(async (ctx, next) => {
//   console.log(ctx.session)
//   ctx.session.count = ctx.session.count || 0
//   ctx.session.count++
//
//   await next()
//
//   ctx.body = ctx.session.count
// })

session({
  cookie: ctx => ({
      maxAge: ctx.session.user ? ONE_MONTH : 0
  })
})

const {route, allowedMethods} = require('./route');

app.use(route);
app.use(allowedMethods);

app.use(convert(static(path.join(__dirname, './dist'))));


// const webpackMiddleware = require("koa-webpack-dev-middleware");
app.listen(9003);
