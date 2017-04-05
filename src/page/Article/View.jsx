import React, {Component} from 'react'
import {Spin, Modal,Input} from 'antd';
import {connect} from 'react-redux'
import * as actions from '../../app/actions.jsx'
import {req} from '../../app/fetch'

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        req({
            url: '/article',
            body: {
                id: this.props.match.params.id
            }
        }).then(data => {
            this.setState({data})
            this.props.dispatch(actions.setTitle({title: data.title, backBtn: true}));
        }, () => {
            Modal.error({title: '温馨提示', content: '文章不存在或网络错误!',onOk() {history.go(-1)}});
        });

    }

    render() {
        const data = this.state.data;
        if (!data)
            return <section className='spin'><Spin/></section>;

        return <section id='article'>
            <h1>{data.title}</h1>
            <p>
                <span>{data.user}</span>
                <span>{(new Date(data.createTime)).toLocaleString()}</span>
            </p>
            <Input placeholder="Basic usage" value={data.article}  type="textarea" autosize disabled/>
        </section>
    }
}

export default connect()(View);
