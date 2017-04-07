const Router = require('koa-router')
const article = new Router();
const getKey = require('./getKey');

const {getArticle, saveArticle, allArticle} = require('../../src/mongo/article.js');

article.post('article', async ctx => {
    const request = JSON.parse(Object.keys(ctx.request.body));
    await getArticle(request).then(data => {
        ctx.body = {
          status:0,
          data:Object.assign(data)
        }
    }, () => {
        ctx.body = {
            status: -1,
            error: '文章不存在!'
        }
    })
})

article.post('article/saveArticle', async ctx => {
    const request = JSON.parse(Object.keys(ctx.request.body));
    await saveArticle(Object.assign(request,{key:getKey(ctx)})).then(() => {
        ctx.body = {
            status: 0,
            message: '发帖成功'
        }
    }, () => {
        ctx.body = {
            status: -1,
            message: '操作失败'
        }
    })
})

article.post('list', async ctx => {
    const request = JSON.parse(Object.keys(ctx.request.body));
    await allArticle(--request.current).then(data => {
        ctx.body = {
            status: 0,
            list: data,
            count: data.count
        }
    }, () => {
        ctx.body = {
            status: -1,
            error: '文章不存在!'
        }
    })
})


module.exports = article;
