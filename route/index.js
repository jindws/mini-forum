const Router = require('koa-router')

const article = require('./routes/article');
let user = require('./routes/user');
const pinglun = require('./routes/pinglun');

let router = new Router();
router.use('/', article.routes());
router.use('/user', user.routes());
router.use('/pinglun', pinglun.routes());

// module.exports = () => router.routes();
exports.route = router.routes();
exports.allowedMethods = router.allowedMethods();
