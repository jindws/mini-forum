import * as actions from './actions.jsx'

export default new class {
    constructor() {
        this.map = new Map();
    }

    set(key, value) {
        this.map.set(key, value);
    }

    get(key) {
        return this.map.get(key);
    }

    context() {
        this.link = data => this.context.Data = data;
    }
    create(name, path,methods) {
        return this.context[name] = this.DB(path,methods);
    }
    DB(path,methods) {
        for (let method in methods) {
            const config = methods[method];
            this[method] = query => new fetchs(config,path, query, method);
        }
        return this;
    }
}

function fetchs(config,path, query, method) {
    let body = Object.assign({}, query);
    return new Promise((resolve, reject) => {
        fetch(path+config.url, {
            credentials: 'include',
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify(body)
        }).then(re => re.json().then(data => {
            // console.log(msg.url)
            // window.__store__.dispatch(actions.Responce(method, resp));
            resolve(data)
        }, data => reject(data)), () => reject());
    })
}


// function fetchs(msg = {}) {
//     let body = Object.assign({}, msg.body || {});
//     return new Promise((resolve, reject) => {
//         fetch(msg.url, {
//             credentials: 'include',
//             method: 'POST',
//             headers: {
//                 "Accept": "application/json",
//                 "Content-Type": "application/x-www-form-urlencoded"
//             },
//             body: JSON.stringify(body)
//         }).then(re => re.json().then(data => {
//             // console.log(msg.url)
//             // window.__store__.dispatch(actions.Responce(method, resp));
//             resolve(data)
//         }, data => reject(data)), () => reject());
//     })
// }
