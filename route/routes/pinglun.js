const Router = require('koa-router')
const getKey = require('./getKey');

let pinglun = new Router();

const {savePinglun} = require('../../src/mongo/PingLun');
const {findUserByKey, findUserById} = require('../../src/mongo/user');
pinglun.post('/add', async ctx => {
    const request = JSON.parse(Object.keys(ctx.request.body));
    await findUserByKey(getKey(ctx)).then(async data => {
        await savePinglun(Object.assign(request, {userId: data._id})).then(() => {
            ctx.body = {
                status: 0,
                message: "success"
            }
            //
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
        data.forEach(async (dt,index) => {
            await findUserById(dt.userId).then( re => {
                datas[index] = (Object.assign({}, JSON.parse(JSON.stringify(dt)), JSON.parse(JSON.stringify(re)),{userId:null}));
                if (datas.filter(t=>t).length === data.length) {
                    resolve(datas);
                }
            })
        })
    })
}

pinglun.post('/getpinglun', async ctx => {
    const {getPinglun} = require('../../src/mongo/PingLun');
    const request = JSON.parse(Object.keys(ctx.request.body));
    await getPinglun(request.articleId).then(async data => {
        await mergeUserAndPL(data).then(list => {
            ctx.body = {
                status: 0,
                list
            }
        },()=>{
          ctx.body = {
              status: 0,
              list:[]
          }
        })
    }, () => {
        ctx.body = {
            status: -1,
            error: '没有得到评论数据'
        }
    })
})


module.exports = pinglun;
