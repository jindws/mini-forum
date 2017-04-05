import Cookie from '../component/Cookie';

exports.req = (...msg) => {
    return fetchs(msg[0]);
}

async function fetchs(msg = {}) {
    const key = Cookie.getCookie('key');
    let body = Object.assign({}, msg.body || {});
    if (key) {
        Object.assign(body, {key: Cookie.getCookie('key')})
    }
    return await new Promise((resolve, reject) => {
        fetch(msg.url, {
            credentials: 'include',
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: JSON.stringify(body)
        }).then(re => {
            re.json().then(data => resolve(data), data => reject(data))
        })
    })
}
