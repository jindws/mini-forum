import React, {Component} from 'react'
import {connect} from 'react-redux'
import {req} from '../../app/fetch'
import * as actions from '../../app/actions.jsx'
import ArticleList from '../index/ArticleList.jsx'
import {Spin, Modal} from 'antd'
class MyArticle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
    }

    componentDidMount() {
        this.props.dispatch(actions.setTitle({title: '我的文章', backBtn: true, right: false}));
        req({url: 'user/myArticles'}).then(re => {
            if (!re.status) {
                this.setState({list: re.list, show: true});
                if (!re.list.length) {
                    Modal.confirm({
                        title: '温馨提示',
                        content: '没有找到文章,来写一篇?',
                        onOk() {
                            location.replace('#/article/write');
                        },
                        onCancel() {
                            history.go(-1);
                        }
                    });
                }
            }
        })
    }

    render() {
        return <section id='list'>
            <ArticleList list={this.state.list}/>
            <section style={{
                display: (this.state.show
                    ? 'none'
                    : '')
            }} className='spin'><Spin/></section>
        </section>
    }
}

export default connect()(MyArticle);
