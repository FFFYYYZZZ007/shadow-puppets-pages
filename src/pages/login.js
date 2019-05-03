import { Button, Checkbox, Col, Form, Icon, Input, Row, message } from 'antd';
import React from 'react';
import styles from './css/login.css';
import router from 'umi/router';
import Link from 'umi/link';
import { login } from '../services/UserService';
import { setCookie } from '../util/cookie.js';

class LoginForm extends React.Component {
    componentWillUpdate() {
        document.getElementById('root').scrollIntoView(true);//为ture返回顶部，false为底部
    };

    handleLogin = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            let temp = values;
            if (temp.userName === undefined || temp.password === undefined) {
                return;
            }
            login(temp).then((result) => {
                console.log(result);
                if (result.code === '200') {
                    message.success('登录成功!');
                    setCookie('ACCESS_TOKEN', result.data);
                    setCookie('userName', result.msg.split(',')[0]);
                    setCookie('admin', result.msg.split(',')[1]);
                    router.push('/');
                } else {
                    message.error(result.msg);
                }
            });
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>

                <Row gutter={16}>
                    <Col offset={8} span={8} align='middle'>
                        <Form onSubmit={this.handleLogin.bind(this)} className={styles.login_form}>
                            <Form.Item>
                                {getFieldDecorator('userName', {
                                    rules: [{ required: true, message: '请输入用户名!' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                                           placeholder="用户名"/>,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: '请输入密码!' }],
                                })(
                                    <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                                           type="password" placeholder="密码"/>,
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('remember', {
                                    valuePropName: 'checked',
                                    initialValue: true,
                                })(
                                    <Checkbox className={styles.login_form_remeber}>记住我</Checkbox>,
                                )}
                                <a className={styles.login_form_forgot} href="/">忘记密码</a>
                                <Button type="primary" htmlType="submit" className={styles.login_form_button}>
                                    登录
                                </Button>
                                Or <Link to="/register">注册</Link>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>

        );
    }

}

const Login = Form.create({ name: 'normal_login' })(LoginForm);

export default Login;
