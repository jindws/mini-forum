const Router = require('koa-router')

let router = new Router();

/////////article
let article = new Router();
const {getArticle, saveArticle, allArticle} = require('./mongo/article.js');
article.post('article', async ctx => {
    const request = JSON.parse(Object.keys(ctx.request.body));
    await getArticle(request).then(data => {
        ctx.body = data
    }, () => {
        ctx.body = {
            status: -1,
            error: '文章不存在!'
        }
    })
})

article.post('article/saveArticle', async ctx => {
    const request = JSON.parse(Object.keys(ctx.request.body));
    await saveArticle(request).then(() => {
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

//////////user
let user = new Router();
const {
    login,
    checkuser,
    regist,
    myuser,
    changeNicheng,
    logout
} = require('./mongo/user.js');
user.post('/login', async ctx => {
    const request = JSON.parse(Object.keys(ctx.request.body));
    await login(request).then(data => {
        // console.log(data)
        // ctx.cookies.set('cid', 'hello world', {
        //     // domain: 'localhost', // 写cookie所在的域名
        //     // path: '/', // 写cookie所在的路径
        //     maxAge: 10 * 60 * 1000, // cookie有效时长
        //     expires: new Date('2017-02-15'), // cookie失效时间
        //     httpOnly: false, // 是否只用于http请求中获取
        //     overwrite: false // 是否允许重写
        // })
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
    await myuser(request).then(data => {
        ctx.body = {
            status: 0,
            data
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
    await changeNicheng(request).then(data => {
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
    await logout(request).then(data => {
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
    const {myArticles} = require('./mongo/user');
    const request = JSON.parse(Object.keys(ctx.request.body));
    await myArticles(request).then(data => {
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

//pinglun

const rpinglun = new Router;
const {savePinglun} = require('./mongo/PingLun');
const {findUserByKey, findUserById} = require('./mongo/user');
rpinglun.post('/add', async ctx => {
    const request = JSON.parse(Object.keys(ctx.request.body));
    await findUserByKey(request.key).then(async data => {
        await savePinglun(Object.assign(request, {userId: data._id})).then(() => {
            ctx.body = {
                status: 0,
                message: "success"
            }
        }, () => {
            ctx.body = {
                status: -1,
                message: '操作失败'
            }
        })
    })
})

function mergeUserAndPL(data) {
    return new Promise((resolve, reject) => {
        let datas = [];
        data.forEach(async dt => {
            await findUserById(dt.userId).then(async re => {
                await datas.push(Object.assign({}, JSON.parse(JSON.stringify(dt)), JSON.parse(JSON.stringify(re)),{userId:null}));
                if (datas.length === data.length) {
                    resolve(datas);
                }
            })
        })
    })
}

rpinglun.post('/getpinglun', async ctx => {
    const {getPinglun} = require('./mongo/PingLun');
    const request = JSON.parse(Object.keys(ctx.request.body));
    await getPinglun(request.articleId).then(async data => {
        await mergeUserAndPL(data).then(list => {
            ctx.body = {
                status: 0,
                list
            }
        })
    }, () => {
        ctx.body = {
            status: -1,
            error: '没有得到评论数据'
        }
    })
})

router.use('/', article.routes());
router.use('/user', user.routes());
router.use('/pinglun', rpinglun.routes());

// module.exports = () => router.routes();
exports.route = router.routes();
exports.allowedMethods = router.allowedMethods();
