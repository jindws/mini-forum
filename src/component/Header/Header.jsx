import React, {Component} from 'react'
import {Menu, Dropdown, Icon, Modal} from 'antd';
const confirm = Modal.confirm;

import {connect} from 'react-redux'

// import Cookie from '../Cookie'
import DB from '../../app/DB'

class Header extends Component {
    constructor() {
        super();
        this.state = {};
        // this.myMenu();
    }

    backBtn() {
        return this.props.myTitle.backBtn
            ? <Icon onClick={() => history.go(-1)} type="left"/>
            : ''
    }

    logOut() {
        confirm({
            title: '温馨提示',
            content: '确认退出登录?',
            onOk: () => {
                DB.User.logout().then(()=>this.myMenu())
            }
        });
    }

    componentWillReceiveProps(){
      this.myMenu();
    }

    async myMenu() {
        DB.User.message().then(()=>{
          this.setState({
            menu:<Menu>
                <Menu.Item key="0">
                    <a href="#/user/index"><Icon type="home" />个人中心</a>
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="1">
                    <a href="#/article/write"><Icon type="book" />发帖</a>
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="3">
                    <a href="javascript:;" onClick={this.logOut.bind(this)}><Icon type="logout" />注销</a>
                </Menu.Item>
            </Menu>
          })
        },()=>{
          this.setState({
            menu:<Menu>
                <Menu.Item key="0">
                    <a href="#/user/login"><Icon type="login" />登录</a>
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="1">
                    <a href="#/user/regist"><Icon type="user" />注册</a>
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key="3">
                    <a href="#/article/write"><Icon type="book" />匿名发帖</a>
                </Menu.Item>
            </Menu>
          })
        })
    }

    render() {
        const title = this.props.myTitle.title;
        document.title = title;
        return <header>
            {this.backBtn.bind(this)()}
            <span>{title}</span>
            {this.props.myTitle.right !== false&&this.state.menu
                ? <Dropdown overlay={this.state.menu} trigger={['click']}>
                        <Icon type="menu-fold"/>
                    </Dropdown>
                : ''}
        </header>
    }
}

const select = state => {
    return {myTitle: state.setTitle}
}

export default connect(select)(Header)
