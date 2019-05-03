import React from 'react';
import { Button, DatePicker, Input, Select, Tabs, message, Popconfirm } from 'antd';
import styles from './css/userInfo.css';
import { changePassword, getUserInfo, updateUser } from '@/services/UserService';
import moment from 'moment';

const TabPane = Tabs.TabPane;
const Option = Select.Option;

class UserInfo extends React.Component {

    constructor(props) {
        super(props);
        this.getUserInfo();
        this.state = {
            id: 0,
            sex: '',
            tel: '',
            userName: '123',
            birthday: '',
            userInfo: {},

            oldPassword: '',
            newPassword: '',
            repeatNewPassword: '',
        };
    }

    componentDidMount() {
        document.getElementById('root').scrollIntoView(true);
    };

    getUserInfo() {
        getUserInfo().then((result) => {
            this.setState({
                id: result.data.id,
                sex: result.data.sex,
                tel: result.data.tel,
                userName: result.data.userName,
                birthday: result.data.birthday,
                userInfo: result.data,
            });
        });
    }

    save = () => {
        let user = {
            id: this.state.id,
            sex: this.state.sex,
            tel: this.state.tel,
            userName: this.state.userName,
            birthday: this.state.birthday,
        };
        updateUser(user).then((result) => {
            if (result.success) {
                message.success(result.msg);
                this.getUserInfo();
            } else {
                message.error(result.msg);
            }
        });
    };

    cancel = () => {
        this.setState({
            sex: this.state.userInfo.sex,
            tel: this.state.userInfo.tel,
            userName: this.state.userInfo.userName,
            birthday: this.state.userInfo.birthday,
        });
    };

    changePassword = () => {
        if (this.state.oldPassword === '' || this.state.newPassword === '' || this.state.repeatNewPassword === '') {
            message.error('请输入密码');
            return;
        }
        if (this.state.newPassword !== this.state.repeatNewPassword) {
            message.error('两次密码不一致');
            return;
        }
        let userPassword = {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword,
            repeatNewPassword: this.state.repeatNewPassword,
        };
        changePassword(userPassword).then((result) => {
            if (result.success) {
                message.success(result.msg);
                this.setState({
                    oldPassword: '',
                    newPassword: '',
                    repeatNewPassword: '',
                });
            } else {
                message.error(result.msg);
            }
        });

    };

    render() {
        return (
            <div className={styles.div_userInfo}>
                <div className={styles.tab_userInfo}>
                    <Tabs tabPosition={'left'} style={{ padding: 30 }}>
                        <TabPane tab="基本信息" key="1">
                            <div style={{ paddingLeft: 50 }}>
                                <label>手机号</label><br/>
                                <Input style={{ width: 200 }}
                                       value={this.state.tel}
                                       onChange={(e) => {
                                           this.setState({ tel: e.target.value });
                                       }}
                                /><br/><br/>
                                <label>用户名</label><br/>
                                <Input style={{ width: 200 }}
                                       value={this.state.userName}
                                       onChange={(e) => {
                                           this.setState({ userName: e.target.value });
                                       }}
                                /><br/><br/>
                                <label>性别</label><br/>
                                <Select value={this.state.sex} style={{ width: 200 }}
                                        onChange={(value) => {
                                            this.setState({ sex: value });
                                        }}
                                >
                                    <Option value="男">男</Option>
                                    <Option value="女">女</Option>
                                </Select><br/><br/>
                                <label>生日</label><br/>
                                <DatePicker style={{ width: 200 }}
                                            value={moment(this.state.birthday)}
                                            onChange={(value) => {
                                                this.setState({
                                                    birthday: value.format('YYYY-MM-DD'),
                                                });
                                            }}
                                /><br/><br/>

                                <Popconfirm title="确认保存？" onConfirm={this.save} okText="保存"
                                            cancelText="取消">
                                    <Button type={'primary'}>保存 </Button>
                                </Popconfirm>
                                &nbsp;&nbsp;&nbsp;
                                <Popconfirm title="确认取消？" onConfirm={this.cancel} okText="确认"
                                            cancelText="不确认">
                                    <Button type={'danger'}>取消 </Button>
                                </Popconfirm>
                            </div>
                        </TabPane>
                        <TabPane tab="安全设置" key="2">
                            <div style={{ paddingLeft: 50 }}>
                                <h1>修改密码</h1>
                                <label>原密码</label><br/>
                                <Input.Password style={{ width: 200 }}
                                                value={this.state.oldPassword}
                                                onChange={(e) => {
                                                    this.setState({ oldPassword: e.target.value });
                                                }}
                                /><br/><br/>
                                <label>新密码</label><br/>
                                <Input.Password style={{ width: 200 }}
                                                value={this.state.newPassword}
                                                onChange={(e) => {
                                                    this.setState({ newPassword: e.target.value });
                                                }}
                                /><br/><br/>
                                <label>重复新密码</label><br/>
                                <Input.Password style={{ width: 200 }}
                                                value={this.state.repeatNewPassword}
                                                onChange={(e) => {
                                                    this.setState({ repeatNewPassword: e.target.value });
                                                }}
                                /><br/><br/>
                                <Popconfirm title="确认保存？" onConfirm={this.changePassword} okText="保存"
                                            cancelText="取消">
                                    <Button type={'primary'}>保存 </Button>
                                </Popconfirm>
                                &nbsp;&nbsp;&nbsp;
                                <Popconfirm title="确认取消？" onConfirm={() => {
                                    this.setState({
                                        oldPassword: '',
                                        newPassword: '',
                                        repeatNewPassword: '',
                                    });
                                }} okText="确认"
                                            cancelText="不确认">
                                    <Button type={'danger'}>取消 </Button>
                                </Popconfirm>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }

}

export default UserInfo;
