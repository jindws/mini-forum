const mongoose = require('mongoose');
const {db} = require('./connect')

const PingLunSchema = new mongoose.Schema({
    articleId: {
        type: String,
        required: true
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
        unique: false,
        required: true
    },
    message: {
        type: String,
        unique: false,
        required: true
    }
})

const PinglunModel = db.model("pinglun", PingLunSchema, "pinglun");

function savePinglun(request) {
    const {addPingLunNum} = require('./article');
    return new Promise((resolve, reject) => {
        PinglunModel.create(request, (error, doc) => {
            if (!error) {
                resolve()
                addPingLunNum(request.articleId)
            } else {
                reject();
            }
        })
    })

}

exports.savePinglun = savePinglun;

function getPinglun(articleId) {
    return new Promise((resolve, reject) => {
        PinglunModel.find({
            articleId
        }, {
            _id: 0,
            createTime: 1,
            message: 1,
            userId: 1
        }).sort({'createTime': -1}).exec((error, docs) => {
            if (docs.length) {
                resolve(docs);
            } else {
                reject();
            }
        })
        //  (error, docs) => {
        //     if (docs.length) {
        //         resolve(docs);
        //     } else {
        //         reject();
        //     }
        // })
    })
}

exports.getPinglun = getPinglun;
