"use strict";

import React, {Component} from 'react'
import {render} from 'react-dom'
import {HashRouter as Router, Route, Switch} from 'react-router-dom'
import {Provider} from 'react-redux'

import Index from '../page/index'
import Header from '../component/Header'
import Article from '../page/Article'
import User from '../page/User'

import {createStore} from 'redux'
import {todoApp} from './reducers.jsx'
let stores = createStore(todoApp);
window.__store__ = stores;
import './default.scss'

class App extends Component {
    constructor() {
        super()
        if (location.port) {
            location.href = `${location.protocol}//${location.hostname}/mini_forum/`
        }
    }
    render() {
        return <section>
            <Header/>
            <section id='body'>
                <Router>
                    <Switch>
                        <Route exact path="/:num" component={Index}/>
                        <Route exact path="/" component={Index}/>
                        <Route path="/article/write" component={Article}/>
                        <Route path="/article/:id" component={Article}/>
                        <Route path="/User/list/:key" component={User}/>
                        <Route path="/User/:type" component={User}/>
                        <Route component={Index}/>
                    </Switch>
                </Router>
            </section>
        </section>
    }
}

render(
    <Provider store={stores}>
    <App/>
</Provider>, document.getElementById('app'));
