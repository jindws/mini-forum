import {combineReducers} from 'redux'
import * as actions from './actions.jsx'


const setTitle = (state = [], action) => {
    switch (action.type) {
        case actions.Title:
            return action.title || {};
        default:
            return state;
    }
}

const setUserMessage = (state = [], action) => {
    switch(action.type){
      case actions.UserMessage:
      console.log(action)
        return action.msg.data||{};
      default:
        return state;
    }
}

exports.todoApp = combineReducers({setTitle,setUserMessage})
