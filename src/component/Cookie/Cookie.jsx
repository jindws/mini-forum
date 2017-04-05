const setCookie = (c_name, value, expiredays) => {
    return new Promise(resolve => {
        let exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = `${c_name}=${escape(value)}${expiredays
            ? (';expires=' + exdate.toGMTString())
            : ''}`;
        resolve();
    })
}

exports.setCookie = setCookie;

exports.clearCookie = name => {
    return setCookie(name, "", -1);
}

exports.getCookie = name =>{
      const re = eval("/" + name + "\=([^;]*)/;");
      const forsearch = document.cookie;
      return  re.exec(forsearch)?decodeURI(re.exec(forsearch)[1]):''
}
