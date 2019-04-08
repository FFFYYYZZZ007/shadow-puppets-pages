import React from 'react';
import styles from './css/register.css';
import router from 'umi/router';
import {
    Form, Input, Row, Col, Button,message
} from 'antd';
import TimedButton from '../components/TimedButton'
import { register } from '../services/UserService'

class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        tel: '',
    };

    // 调用生命周期钩子函数，清除由于路由跳转未卸载的组件(此页面是MyButton,由于其中使用了异步定时任务)
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    //改变手机号调用的方法
    handleChangeTel = (e) => {
        this.setState({
            tel: e.target.value,
        })
    }

    handleRegister = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            let temp = values;
            if (temp.userName === undefined || temp.password === undefined
                || temp.tel === undefined || temp.code === undefined) {
                return;
            }
            let passwordLength =  temp.password.length;
            if (passwordLength < 8||passwordLength > 13){
                message.error('密码长度应在8-12位！');
                return;
            }
            register(temp).then((result) => {
                console.log(result);
                if (result.code === '200') {
                    message.success('注册成功，即将跳转到登录界面');
                    router.push('/login');
                } else {
                    message.error(result.msg);
                }
            })
        });
    }

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不一致!');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    }

    render() {

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };

        return (
            <div>
                <Row gutter={16}>
                    <Col offset={8} span={8} align='middle'>
                        <Form {...formItemLayout} onSubmit={this.handleRegister} className={styles.register_form}>
                            <Form.Item
                                label="用户名"
                            >
                                {getFieldDecorator('userName', {
                                    rules: [{ required: true, message: '请输入用户名!', whitespace: true }],
                                })(
                                    <Input />
                                )}
                            </Form.Item>
                            <Form.Item
                                label="密码"
                            >
                                {getFieldDecorator('password', {
                                    rules: [{
                                        required: true, message: '请输入密码!',
                                    }, {
                                        validator: this.validateToNextPassword,
                                    }],
                                })(
                                    <Input type="password" />
                                )}
                            </Form.Item>
                            <Form.Item
                                label="确认密码"
                            >
                                {getFieldDecorator('confirm', {
                                    rules: [{
                                        required: true, message: '请确认密码!',
                                    }, {
                                        validator: this.compareToFirstPassword,
                                    }],
                                })(
                                    <Input type="password" onBlur={this.handleConfirmBlur} />
                                )}
                            </Form.Item>

                            <Form.Item
                                label="手机号码"
                            >
                                {getFieldDecorator('tel', {
                                    rules: [{ required: true, message: '请输入手机号!' }],
                                })(
                                    <Input onChange={this.handleChangeTel}/>
                                )}
                            </Form.Item>
                            <Form.Item
                                label="验证码"
                            >
                                <Row gutter={8}>
                                    <Col span={12}>
                                        {getFieldDecorator('code', {
                                            rules: [{ required: true, message: '请输入验证码!' }],
                                        })(
                                            <Input />
                                        )}
                                    </Col>
                                    <Col span={12}>
                                        <TimedButton tel={this.state.tel}>获取验证码</TimedButton>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item {...tailFormItemLayout}>
                                <Button type="primary" htmlType="submit" className={styles.register_form_button}>注册</Button>
            
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>

        );
    }
}

const Register = Form.create({ name: 'register' })(RegistrationForm);

export default Register;
