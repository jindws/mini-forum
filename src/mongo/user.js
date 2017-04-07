const mongoose = require('mongoose');
const {db} = require('./connect')

const md5 = require('md5');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nicheng: {
        type: String,
        unique: true,
        required: false
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    question: {
        type: String
    },
    answer: {
        type: Date
    },
    key: {
        type: String
    }
})

const UserModel = db.model("user", UserSchema, "user");

/**
 * 登录
 */
function toLogin(request) {
    return new Promise((resolve, reject) => {
        UserModel.findOne({
            username: request.username,
            password: request.password
        }, {
            username: 1,
            nicheng: 1,
            createDate: 1
        }, async(error, docs) => {
            if (docs) {
                const key = md5(`${docs._id}${Date.now()}`);
                await updateKey(docs._id, key)
                resolve(Object.assign({}, JSON.parse(JSON.stringify(docs)), {key, _id: null}));
            } else {
                reject();
            }
        });
    })
}

function updateKey(id, key) {
    return new Promise((resolve, reject) => {
        UserModel.findByIdAndUpdate(id, {key}).then(() => {
            resolve();
        })
    })

}

exports.login = request => toLogin(request);

/**
 * 注册
 */
function checkusers(request) {
    return new Promise((resolve, reject) => {
        UserModel.findOne(request, {
            username: 1
        }, (error, docs) => {
            if (!docs) { //没有注册过
                resolve()
            } else {
                reject();
            }
        });
    })
}

exports.checkuser = request => checkusers(request);
exports.regist = request => {
    return new Promise((resolve, reject) => {
        checkusers({username: request.username}).then(() => {
            UserModel.create(request, (error, docs) => {
                if (!error) {
                    resolve()
                } else {
                    reject();
                }
            });
        }, () => {
            reject();
            // UserModel.create(request, (error, docs) => {
            //     if (!error) {
            //         resolve()
            //     } else {
            //         reject();
            //     }
            // });
        })
    })
}

/**
 * 个人信息
 */

function findUserByKey(key) {
    return new Promise((resolve, reject) => {
        UserModel.findOne({
            key
        }, {
            nicheng: 1,
            username: 1,
            createDate: 1
        }).exec((error, docs) => {
            if (docs) {
                resolve(docs)
            } else {
                reject()
            }
        })
    })
}

exports.findUserByKey = findUserByKey;

exports.myuser = request => {
    const {findArticleByUserId_Count} =require('./article');
    return new Promise((resolve,reject)=>[
        findUserByKey(request.key).then(data=>{
            findArticleByUserId_Count(data._id).then(articleNum=>{
              resolve(Object.assign({},JSON.parse(JSON.stringify(data)),{articleNum}))
            })
        })
    ])

}

exports.changeNicheng = request => {
    const nicheng = request.nicheng;
    return new Promise((resolve, reject) => {
        checkusers({nicheng}).then(() => {
            UserModel.findOneAndUpdate({
                key: request.key
            }, {
                nicheng
            }, (error, docs) => {
                if (docs) {
                    resolve()
                } else {
                    reject({error: 操作失败})
                }
            })
        }, () => {
            reject({error: '该昵称已被使用'})
        })
    })
}

function findUserById(id){
  return new Promise((resolve,reject)=>[
      UserModel.findById(id,{
        _id:0,
        username:1,
        nicheng:1,
      },(error,docs)=>{
          if(docs){
            resolve(docs)
          }else{
            reject();
          }
      })
  ])
}

exports.findUserById = findUserById;

/**
 * 注销
 */

exports.logout = request => {
    return new Promise((resolve, reject) => {
        UserModel.findOneAndUpdate({
            key: resolve.key
        }, {
            key: md5(Date.now())
        }).then(() => {
            resolve();
        })
    })
}

// const {}
/**
 * 我的文章
 */
exports.myArticles = request => {
    const {findArticlesByUserId} =require('./article');
    return new Promise((resolve, reject) => {
        findUserByKey(request.key).then(data => {
            findArticlesByUserId(data._id).then(re=>{
                resolve(re);
            },()=>reject());
        })
    })
}
