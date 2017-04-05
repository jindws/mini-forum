import React, {Component} from 'react'
import {connect} from 'react-redux'
import * as actions from '../../app/actions.jsx'
import {req} from '../../app/fetch'
import {Button, Modal, Input} from 'antd'

class Index extends Component {
    constructor() {
        super();
        this.state = {
            user: {
              nicheng:'-'
            },
            ModalText: '',
            visible: false
        }
    }

    showModal() {
        this.setState({visible: true});
    }
    handleOk() {
        this.setState({confirmLoading: true});
        req({
            url: 'user/changeNicheng',
            body: {
                nicheng: this.state.newNicheng
            }
        }).then(data => {
            if (!data.status) {
                this.setState({visible: false})
                Modal.success({title: '温馨提示', content: '操作成功'});
                this.componentDidMount();
            }else{
              this.setState({
                  ModalText:data.error,
                  confirmLoading:false,
              })
            }
        })
    }
    handleCancel() {
        console.log('Clicked cancel button');
        this.setState({visible: false});
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
                    <label style={{
                            visibility: (zhuceDay
                            ? ''
                            : 'hidden')
                    }}>您已注册{zhuceDay}天</label>
                  <Button style={{display:(user.nicheng?'none':'')}} type="dashed" onClick={this.showModal.bind(this)}>添加昵称</Button>
                    <Modal title="您仅有一次修改的机会" visible={this.state.visible} onOk={this.handleOk.bind(this)} confirmLoading={this.state.confirmLoading} onCancel={this.handleCancel.bind(this)}>
                        <p>{this.state.ModalText}</p>
                        <Input onBlur={e => {
                            this.setState({newNicheng: e.target.value})
                        }} placeholder='昵称'/>
                    </Modal>
                </dt>
                <dd></dd>
            </dl>
            <a href="javascript:;"></a>
            <div></div>
        </section>
    }
}

export default connect()(Index);
