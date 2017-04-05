import React, {Component} from 'react'
import View from './View.jsx'
import Write from './Write.jsx'

class Article extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.match.path === "/article/write") { //
            return <Write/>
        }
        return <View {...this.props}/>
    }
}

export default Article;
