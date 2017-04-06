import React, {Component} from 'react'
import {Icon} from 'antd'

export default class ArticleList extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <dl>
            {this.props.list.map((it, index) => {
                return <dd key={`article_${index}`} onClick={() => location.hash = `article/${it._id}`}>
                    <p>{it.title}</p>
                    <div>
                        <time>{(new Date(it.createTime)).toLocaleString()}</time>
                        <label>{it.user}</label>
                        <Icon type="eye-o"/>{it.see}
                        <Icon type="message"/>2
                    </div>
                </dd>
            })
}
        </dl>
    }
}
