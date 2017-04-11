import React, {Component} from 'react'
import {connect} from 'react-redux'
import * as actions from '../../app/actions.jsx'
import DB from '../../app/DB'

import {
    Form,
    Input,
    Tooltip,
    Icon,
    Button,
    Modal
} from 'antd';

const FormItem = Form.Item;
class RegistrationForm extends React.Component {
    constructor() {
        super();
        this.state = {
            confirmDirty: false,
            validateStatus: {}
        }
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (this.state.password !== this.state.repassword) {
                    this.setState(prevState => ({validateStatus: Object.assign({}, prevState.validateStatus, {repassword: 'error'})}))
                } else {
                  DB.User.regist({
                    username: values.username,
                    password: md5(values.password),
                    nicheng: values.nicheng
                  }).then(data => {
                        if (!data.status) {
                            Modal.success({
                                title: '温馨提示',
                                content: '注册成功',
                                onOk() {
                                    location.hash = '';
                                }
                            })
                        } else {
                            Modal.error({title: '温馨提示', content: data.error})
                        }

                    })
                }
            }
        });
    }
    checkPassword() {
        const s = this.state;
        if (s.password === s.repassword) {
            if (s.password) {
                this.setState(prevState => ({validateStatus: Object.assign({}, prevState.validateStatus, {repassword: 'success'})}))
            }
        } else {
            if (s.password && s.repassword) {
                this.setState(prevState => ({validateStatus: Object.assign({}, prevState.validateStatus, {repassword: 'error'})}))
            } else {
                this.checkClear('repassword');
            }
        }
    }

    checkClear(name) {
        this.setState(prevState => ({validateStatus: Object.assign({}, prevState.validateStatus, {[name]: ''})}))
    }

    checkNow(name, val) {
        this.setState(prevState => ({validateStatus: Object.assign({}, prevState.validateStatus, {[name]: 'validating'})}));

        DB.User.checkuser({[name]:val}).then(data => this.setState(prevState => ({validateStatus: Object.assign({},
            prevState.validateStatus,
             {[name]: 'success'})})),
        ()=>this.setState(prevState => ({validateStatus: Object.assign({},
           prevState.validateStatus,
            {[name]: 'error'})})))
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 6
                }
            },
            wrapperCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 14
                }
            }
        };
        return (
            <Form onSubmit={this.handleSubmit.bind(this)}>
                <FormItem label="用户名" hasFeedback validateStatus={this.state.validateStatus.username} help={this.state.validateStatus.username === 'error'
                    ? "用户名已被使用"
                    : ''}>
                    {getFieldDecorator('username', {
                        rules: [
                            {
                                required: true,
                                message: '请输入用户名!'
                            }
                        ]
                    })(
                        <Input autoComplete={false} onFocus={() => this.checkClear('username')} onBlur= {e=>{ const val = e.target.value; if(val){ this.checkNow('username',val) } }} prefix={< Icon type = "user" style = {{ fontSize: 13 }}/>} placeholder="用户名"/>
                    )}
                </FormItem>
                <FormItem hasFeedback label="密码">
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: '请输入密码!'
                            }
                        ]
                    })(
                        <Input onBlur={async e => {
                            await this.setState({password: e.target.value});
                            this.checkPassword()
                        }} prefix={< Icon type = "lock" style = {{ fontSize: 13 }}/>} type="password" placeholder="密码"/>
                    )}
                </FormItem>
                <FormItem hasFeedback validateStatus={this.state.validateStatus.repassword} help={this.state.validateStatus.repassword === 'error'
                    ? "两次密码输入不一致"
                    : ''}>
                    {getFieldDecorator('repassword', {
                        rules: [
                            {
                                required: false,
                                message: '请再次输入密码!'
                            }
                        ]
                    })(
                        <Input onFocus={() => this.checkClear('repassword')} onBlur={async e => {
                            await this.setState({repassword: e.target.value});
                            this.checkPassword()
                        }} prefix={< Icon type = "lock" style = {{ fontSize: 13 }}/>} type="password" placeholder="密码"/>
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label={(
                    <span>
                        昵称&nbsp;
                        <Tooltip title="不可重复,可不填">
                            <Icon type="question-circle-o"/>
                        </Tooltip>
                    </span>
                )} hasFeedback validateStatus={this.state.validateStatus.nicheng} help={this.state.validateStatus.nicheng === 'error'
                    ? "昵称已被使用"
                    : ''}>
                    {getFieldDecorator('nicheng', {
                        rules: [
                            {
                                required: false,
                                whitespace: true
                            }
                        ]
                    })(<Input autoComplete={false} onFocus={() => this.checkClear('nicheng')} onBlur= {e=>{ const val = e.target.value; if(val){ this.checkNow('nicheng',val) } }} placeholder='昵称'/>)}
                </FormItem>
                <FormItem>
                    <Button className='login-form-button' type="primary" htmlType="submit" size="large">注册</Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

class Regist extends Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.props.UserMessage.username&&history.go(-1);
    }
    componentDidMount() {
        this.props.dispatch(actions.setTitle({title: '注册', backBtn: true, right: false}));
    }
    render() {
        return <section id='login'><WrappedRegistrationForm/></section>
    }
}

const select = state => {
    return {UserMessage: state.setUserMessage}
}


export default connect(select)(Regist);
