import React, {Component} from 'react'
import Login from './Login.jsx'
import Regist from './Regist.jsx'
import Index from './index.jsx'
import MyArticle from './MyArticle.jsx'

class User extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        switch (this.props.match.params.type) {
            case 'login':
                return <Login/>
            case 'regist':
              return <Regist/>
            case 'index':
              return <Index/>
            case 'myarticle':
              return <MyArticle/>
        }

    }
}

export default User;
