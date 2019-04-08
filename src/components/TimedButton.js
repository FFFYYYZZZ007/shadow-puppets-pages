import React from 'react';
import { Button, message } from 'antd';
import { sendVerificationCode } from '../services/UserService'


class MyButton extends React.Component {

    state = {
        time: 60,
        btnDisable: false,
        btnContent: '发送验证码'
    };

    render() {
        //从父组件穿过来的tel
        const tel = this.props.tel;
        let timeChange;
        let ti = this.state.time;
        //关键在于用ti取代time进行计算和判断，因为time在render里不断刷新，但在方法中不会进行刷新
        const clock = () => {
            if (ti > 0) {
                //当ti>0时执行更新方法
                ti = ti - 1;
                this.setState({
                    time: ti,
                    btnContent: ti + "s",
                });
            } else {
                //当ti=0时执行终止循环方法
                clearInterval(timeChange);
                this.setState({
                    btnDisable: false,
                    time: 60,
                    btnContent: "发送验证码",
                });
            }
        };

        const sendCode = () => {
            this.setState({
                btnDisable: true,
                btnContent: "60s",
            });
            sendVerificationCode(tel).then((result) => {
                console.log(result);
                if (result.code === '200') {
                    message.success('发送验证码成功!');
                } else {
                    message.error(result.msg);
                }
            })

            //每隔一秒执行一次clock方法
            timeChange = setInterval(clock, 1000);
        };

        return (
            <React.Fragment>
                <Button style={{ width: 100 }} inline='true' onClick={sendCode} disabled={this.state.btnDisable}>{this.state.btnContent}</Button>
            </React.Fragment>
        )
    }
}

export default MyButton;