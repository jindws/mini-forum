import React, {Component} from 'react'
import {connect} from 'react-redux'
import * as actions from '../../app/actions.jsx'
import {req} from '../../app/fetch'
import {Button, Modal, Input, Icon} from 'antd'

class Index extends Component {
    constructor() {
        super();
        this.state = {
            user: {
                nicheng: '-'
            },
            ModalText: '',
            visible: false
        }
    }

    showModal() {
        this.setState({visible: true});
    }
    handleOk() {
        const nicheng = this.state.newNicheng;
        if (!nicheng) {
            this.setState({ModalText: '不能使用空白昵称!', confirmLoading: false})
            return;
        }
        this.setState({confirmLoading: true});
        req({url: 'user/changeNicheng', body: {
                nicheng
            }}).then(data => {
            if (!data.status) {
                this.setState({visible: false})
                Modal.success({title: '温馨提示', content: '操作成功'});
                this.componentDidMount();
            } else {
                this.setState({ModalText: data.error, confirmLoading: false})
            }
        })
    }

    componentDidMount() {
        this.props.dispatch(actions.setTitle({title: '个人中心', backBtn: true, right: false}));
        req({url: 'user/message'}).then(re => {
            if (!re.status) {
                this.setState({user: re.data})
            }
        })
    }

    render() {
        const user = this.state.user;
        const zhuceDay = ~~((new Date() - new Date(user.createDate)) / 24 / 60 / 60 / 1000);
        return <section id='user_index'>
            <dl>
                <dt>欢迎用户:{user.nicheng || user.username}
                    <label>您已注册{zhuceDay + 1}天</label>
                    <Button style={{
                        display: (user.nicheng
                            ? 'none'
                            : '')
                    }} type="dashed" onClick={this.showModal.bind(this)}>添加昵称</Button>
                    <Modal title="您仅有一次修改的机会" visible={this.state.visible} onOk={this.handleOk.bind(this)} onCancel={() => {
                        this.setState({visible: false})
                    }} confirmLoading={this.state.confirmLoading}>
                        <p>{this.state.ModalText}</p>
                        <Input onBlur={e => {
                            this.setState({newNicheng: e.target.value})
                        }} onFocus={()=>{this.setState({ModalText:''})}} placeholder='昵称'/>
                    </Modal>
                </dt>
                <dd className='myarticle' onClick={() => location.hash = 'user/myarticle'}>
                    <Icon type="book"/>我的文章
                    <label>{user.articleNum}</label>
                </dd>
            </dl>
            <div></div>
        </section>
    }
}

export default connect()(Index);
