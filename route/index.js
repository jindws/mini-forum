const Router = require('koa-router')

function getKey(ctx){
	   const re = eval("/" + "key" + "\=([^;]*)/;");
     const cookie = ctx.request.header.cookie;
     return  re.exec(cookie)?decodeURI(re.exec(cookie)[1]):''
}

const article = require('./routes/article');
const user = require('./routes/user');
const pinglun = require('./routes/pinglun');


pinglun.getKey=article.getKey=user.getKey = getKey;

let router = new Router();
router.use('/', article.routes());
router.use('/user', user.routes());
router.use('/pinglun', pinglun.routes());

// module.exports = () => router.routes();
exports.route = router.routes();
exports.allowedMethods = router.allowedMethods();
