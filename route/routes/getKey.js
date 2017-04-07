module.exports = ctx=>{
  const re = eval("/" + "key" + "\=([^;]*)/;");
  const cookie = ctx.request.header.cookie;
  return  re.exec(cookie)?decodeURI(re.exec(cookie)[1]):''
}
