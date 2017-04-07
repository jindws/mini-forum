import DBF from './fetch'

export default DBF.context;

DBF.create('Index','', {
    getList: {
        url: '/list'
    }
});

DBF.create('Article','' ,{
    article: {
        url: '/article'
    },
    getPinglun: {
        url: '/pinglun/getpinglun'
    },
    addPingLun:{
      url:'/pinglun/add'
    },
    saveArticle:{
      url:'/article/saveArticle'
    }
});


DBF.create('User', '/user',{
    changeNicheng: {
        url: '/changeNicheng'
    },
    login:{
      url:'/login'
    },
    message:{
      url:'/message'
    },
    myArticles:{
      url:'/myArticles'
    },
    regist:{
      url:'/regist'
    },
    checkuser:{
      url:'/checkuser'
    },
    logout:{
      url:'/logout'
    }
});
