const Router = require('koa-router')

let user = new Router();
const {
    login,
    checkuser,
    regist,
    myuser,
    changeNicheng,
    logout
} = require('../../src/mongo/user');
user.post('/login', async ctx => {
    const request = JSON.parse(Object.keys(ctx.request.body));
    await login(request).then(data => {
        ctx.body = {
            status: 0,
            data
        }
    }, () => {
        ctx.body = {
            status: -1,
            error: '用户名或密码错误!'
        }
    })
})

user.post('/checkuser', async ctx => {
    const request = JSON.parse(Object.keys(ctx.request.body));
    await checkuser(request).then(data => {
        // ctx.body = {
        //     status: -1,
        //     error: '不可注册'
        // }
        ctx.body = {
            status: 0
        }
    }, () => {
        // ctx.body = {
        //     status: 0
        // }
        ctx.body = {
            status: -1,
            error: '不可注册'
        }
    })
})

user.post('/regist', async ctx => {
    const request = JSON.parse(Object.keys(ctx.request.body));
    await regist(request).then(data => {
        ctx.body = {
            status: 0,
            error: '注册成功'
        }
    }, () => {
        ctx.body = {
            status: -1,
            error: '注册失败'
        }
    })
})

user.post('/message', async ctx => {
    const request = JSON.parse(Object.keys(ctx.request.body));
    await myuser(Object.assign(request,{key:getKey(ctx)})).then(data => {
        ctx.body = {
            status: 0,
            data:Object.assign(data,{_id:null}),
        }
    }, () => {
        ctx.body = {
            status: -1000,
            error: '登录已失效'
        }
    })
})

user.post('/changeNicheng', async ctx => {
    const request = JSON.parse(Object.keys(ctx.request.body));
    await changeNicheng(Object.assign(request,{key:getKey(ctx)})).then(data => {
        ctx.body = {
            status: 0,
            result: 'success'
        }
    }, data => {
        ctx.body = {
            status: -1,
            error: data.error
        }
    })
})

user.post('/logout', async ctx => {
    const request = JSON.parse(Object.keys(ctx.request.body));
    await logout(Object.assign(request,{key:getKey(ctx)})).then(data => {
        ctx.body = {
            status: 0,
            result: 'success'
        }
    }, data => {
        ctx.body = {
            status: -1,
            error: data.error
        }
    })
})

user.post('/myArticles', async ctx => {
    const {myArticles} = require('../src/mongo/user');
    const request = JSON.parse(Object.keys(ctx.request.body));
    await myArticles(Object.assign(request,{key:getKey(ctx)})).then(data => {
        ctx.body = {
            status: 0,
            list: data
        }
    }, () => {
        ctx.body = {
            status: -1,
            error: '查询失败'
        }
    })
})

module.exports = user;
