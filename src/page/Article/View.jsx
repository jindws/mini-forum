import React, {Component} from 'react'
import {Spin, Modal, Input, Tabs, Button} from 'antd';
import {connect} from 'react-redux'
import * as actions from '../../app/actions.jsx'
import {req} from '../../app/fetch'
const TabPane = Tabs.TabPane;
import Cookie from '../../component/Cookie'

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iconLoading: false,
            activityKey: 1,
            PLloading:true,
            pingluns:{
              list:[]
            }
        }
    }

    componentDidMount() {
        req({
            url: '/article',
            body: {
                id:this.props.match.params.id
            }
        }).then(data => {
            this.setState({data})
            this.props.dispatch(actions.setTitle({title: data.title, backBtn: true}));
            this.getPinglun();
        }, () => {
            Modal.error({
                title: '温馨提示',
                content: '文章不存在或网络错误!',
                onOk() {
                    history.go(-1)
                }
            });
        })
    }

    getPinglun(){
      req({
          url:'/pinglun/getpinglun',
          body:{
            articleId:this.props.match.params.id
          }
      }).then(pingluns=>[
          this.setState({
            PLloading:false,
            pingluns
          })
      ])
    }

  changeTab(key) {
      if (+ key === 2) {
          if (!Cookie.getCookie('key')) {
              Modal.confirm({
                  title: '温馨提示',
                  content: '请先登录!',
                  okText: '现在登录',
                  cancelText: '取消',
                  onOk: () => location.hash = '#/user/login'
              });
          } else {
              this.setState({activityKey: 2})
          }
      } else {
          this.setState({activityKey: 1})
      }
  }

    submit() {
        this.setState({iconLoading: true});
        if(!this.state.message){
          Modal.warning({
              title: '温馨提示',
              content: '请填写评论',
              onOk: () => {
                  this.setState({iconLoading: false});
              }
          });
          return;
        }
        req({
            url: 'pinglun/add',
            body: {
                articleId: this.props.match.params.id,
                message: this.state.message
            }
        }).then(data => {
            if (!data.status) {
                Modal.success({
                    title: '温馨提示',
                    content: '操作成功',
                    onOk: async () => {
                        await this.setState({iconLoading: false, activityKey: 1, message: '',PLloading:true});
                        this.getPinglun();
                    }
                });
            }else{
              Modal.error({
                  title: '温馨提示',
                  content: '操作失败',
                  onOk: () => {
                      this.setState({iconLoading: false});
                  }
              });
            }

        })
    }

    render() {
        const data = this.state.data;
        console.log(this.state.pingluns)
        if (!data){
            return <section className='spin'><Spin/></section>;
        }
        return <section id='article'>
              <div id='top'>
                  <h1>{data.title}</h1>
                  <p><span>作者:{data.user}</span>
                  <span>{(new Date(data.createTime)).toLocaleString()}</span></p>
              </div>
              <Input id='main' value={data.article} type="textarea" autosize disabled/>
              <Tabs id='pinglun' activeKey={`${this.state.activityKey}`} onChange={this.changeTab.bind(this)}>
                  <TabPane tab="最新评论" key="1">
                    <Spin spinning={this.state.PLloading} tip="Loading...">
                        <dl>
                        {
                            this.state.pingluns.list.map((m,ind)=><dd key={`list_${ind}`}>
                                      <Input type="textarea" value={m.message} autosize disabled/>
                            </dd>)
                        }
                      </dl>
                    </Spin>
                  </TabPane>
                  <TabPane tab="我要评论" key="2">
                      <Spin spinning={this.state.iconLoading} tip="Loading...">
                          <Input onChange={e=>this.setState({message:e.target.value})} value={this.state.message} placeholder='请输入你的评论' type="textarea" autosize={{minRows: 3}}/>
                      </Spin>
                      <Button type="primary" loading={this.state.iconLoading} onClick={this.submit.bind(this)}>
                          提交
                      </Button>
                  </TabPane>
              </Tabs>
            </section>
    }
}

export default connect()(View);
