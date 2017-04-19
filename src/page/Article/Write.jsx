import React, {Component} from 'react'
import {connect} from 'react-redux'
import * as actions from '../../app/actions.jsx'
import {Input, Button, Modal} from 'antd'
import DB from '../../app/DB'
import Remarkable from 'remarkable'

class Write extends Component {

    constructor() {
        super();
        this.state = {
            title: '',
            article: '',
            preview:false,
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

        DB.Article.saveArticle({
          title: this.state.title,
          article: this.state.article
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

    getRawMarkup() {
      const md = new Remarkable();
      md.set({
          html: true,
          breaks: true
      });
      return { __html: md.render(this.state.article) };
    }

    render() {
        return <section id='write'>
            <Input onChange={e => {
                this.setState({title: e.target.value})
            }} id='title' placeholder='文章标题'/>

            <Input onChange={e => {
                this.setState({article: e.target.value})
            }} id='message' type="textarea" rows={3} placeholder='现已支持markdown格式' autosize={{
                minRows: 4
            }}/>

          <a style={{display:(this.state.article?'':'none')}} onClick={()=>{
              Modal.error({
                  title: '预览模式(仅供参考)',
                  okText:'确定',
                  content: <div
                    className="content"
                    dangerouslySetInnerHTML={this.getRawMarkup()}
                  />,
              });
            }} href='javascript:;' >预览</a>

            <Button type="primary" loading={this.state.loading} onClick={this.subMit.bind(this)}>
                提交{this.state.preview}1
            </Button>

        </section>
    }
}

export default connect()(Write);
