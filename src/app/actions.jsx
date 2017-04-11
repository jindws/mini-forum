const Title = 'Title';

const setTitle = title =>{
  return {type: Title, title}
};

const UserMessage = 'UserMessage';

const setUserMessage = msg=>{
  return{type:UserMessage,msg}
}

export {
  Title,
  setTitle,
  UserMessage,
  setUserMessage,
}
