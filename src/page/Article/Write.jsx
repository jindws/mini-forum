import React, {Component} from 'react'
import {connect} from 'react-redux'
import * as actions from '../../app/actions.jsx'
import {req} from '../../app/fetch'
import {Input, Button, Modal} from 'antd'

class Write extends Component {

    constructor() {
        super();
        this.state = {
            title: '',
            article: ''
        }
    }
    subMit() {
        this.setState({loading: true});
        let error;
        if (!this.state.title) {
            error = '请输入文章标题'
        } else if (!this.state.article) {
            error = '请输入文章内容'
        }

        if (error) {
            Modal.error({
                title: '温馨提示',
                content: error,
                onOk: () => this.setState({loading: false})
            });
            return;
        }
        req({
            url: 'article/saveArticle',
            body: {
                title: this.state.title,
                article: this.state.article
            }
        }).then(data => {
            if (!data.status) { //success
                Modal.success({
                    title: '温馨提示',
                    content: '发布成功',
                    onOk() {
                        location.replace('#')
                    }
                });
            } else {
                Modal.error({
                    title: '温馨提示',
                    content: data.error,
                    onOk: () => this.setState({loading: false})
                });
            }
        })
    }
    componentDidMount() {
        this.props.dispatch(actions.setTitle({title: '编辑文章', backBtn: true, right: false}));
    }
    render() {
        return <section id='write'>
            <Input onChange={e => {
                this.setState({title: e.target.value})
            }} id='title' placeholder='文章标题'/>
            <Input onChange={e => {
                this.setState({article: e.target.value})
            }} id='message' type="textarea" rows={3} placeholder='文章内容' autosize={{
                minRows: 4
            }}/>

            <Button type="primary" loading={this.state.loading} onClick={this.subMit.bind(this)}>
                提交
            </Button>
        </section>
    }
}

export default connect()(Write);
