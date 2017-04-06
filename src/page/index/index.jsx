import React, {Component} from 'react'

import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import * as actions from '../../app/actions.jsx'
import {Spin, Icon, Pagination} from 'antd'
import {req} from '../../app/fetch'
import ArticleList from './ArticleList.jsx'
import './index.css'
class Index extends Component {
    constructor(props) {
        super(props);
        const num = this.props.match.params.num;
        this.state = {
            data: {},
            current: + num || 1
        }
    }

    componentDidMount() {
        this.props.dispatch(actions.setTitle({title: '话题', backBtn: false}));
        this.getList();
    }

    getList() {
        req({
            url: '/list',
            body: {
                current: this.state.current
            }
        }).then(data => this.setState({data}));
    }

    changeCurrent(current) {
        location.hash = current;
        this.setState({
            current
        }, () => this.getList());
    }

    render() {
        const data = this.state.data;
        console.log()
        if (!data) {
            return <section className='spin'><Spin/></section>;
        } else if (!data.list) {
            return <section className='spin'><Icon type="loading"/>暂无内容</section>
        }
        return <section id='list'>
            <ArticleList list={data.list}/>
            <Pagination simple current={this.state.current} onChange={this.changeCurrent.bind(this)} total={this.state.data.count} pageSize={10}/>
        </section>
    }
}

export default connect()(Index);
