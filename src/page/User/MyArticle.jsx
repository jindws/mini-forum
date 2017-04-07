import React, {Component} from 'react'
import {connect} from 'react-redux'
import * as actions from '../../app/actions.jsx'
import ArticleList from '../index/ArticleList.jsx'
import {Spin, Modal} from 'antd'
import DB from '../../app/DB'

class MyArticle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            key:this.props.match.params.key,
        }
    }

    componentDidMount() {
        const key = this.state.key;
        key||this.setTitle('我的文章');
        DB.User.myArticles({id:key}).then(re => {
            if (!re.status) {
                key&&this.setTitle(re.user+'的文章');
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

    setTitle(title){
        this.props.dispatch(actions.setTitle({
              title,
              backBtn: true,
              right: false
          })
        );
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
