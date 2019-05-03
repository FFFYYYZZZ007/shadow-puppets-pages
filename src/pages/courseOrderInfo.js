import React from 'react';
import styles from './css/pay.css';
import { Row, Col, Divider, Button, message, Modal, Drawer, Rate, Input } from 'antd';
import { closeOrder, getOrderInfo, getPayUrl, checkTradeStatus, confirmStudy } from '@/services/CourseService';
import router from 'umi/router';

const { TextArea } = Input;

class CourseOrderInfo extends React.Component {

    static GetUrlByParamName(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        let URL = decodeURI(window.location.search);
        let r = URL.substr(1).match(reg);
        if (r != null) {
            //decodeURI() 函数可对 encodeURI() 函数编码过的 URI 进行解码
            return decodeURI(r[2]);
        }
        return null;
    };

    state = {
        order: {
            courseVO: {},
        },
        html: '',
        visible: false,
        drawerVisible: false,
        commentVisible: false,
        content: '',
        starLevel: 0,
    };

    constructor(props) {
        document.getElementById('root').scrollIntoView(true);//为ture返回顶部，false为底部
        super(props);
        let id = CourseOrderInfo.GetUrlByParamName('orderId');
        this.getOrder(id);
    }

    getOrder(id) {
        getOrderInfo(id).then((result) => {
            console.log(result.data);
            this.setState({
                order: result.data,
            });
        });
    }

    closeOrder() {
        console.log('111');
        let id = this.state.order.id;
        closeOrder(id).then((result) => {
            this.showMessage(result);
            this.getOrder(id);
        });
    }

    pay = () => {
        getPayUrl(this.state.order.id).then((result) => {
            console.log(result.data);
            this.setState({ html: result.data });
            this.showPayModal();
            this.checkStatus();
        });
    };

    showPayModal = () => {
        this.setState({
            visible: true,
        });
    };

    handlePayOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    payCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    checkStatus = () => {
        console.log(this.state.visible);
        if (this.state.visible === false) {
            return;
        }
        checkTradeStatus(this.state.order.id).then((result) => {
            if (result.success === true) {
                message.success(result.msg);
                this.setState({
                    visible: false,
                });
                this.getOrder(this.state.order.id);
            }
        });
        setTimeout(() => this.checkStatus(), 2000);
    };

    showMessage(result) {
        if (result.success === true) {
            message.success(result.msg, 1);
        } else {
            message.error(result.msg, 1);
        }
    }

    showDrawer = () => {
        this.setState({
            drawerVisible: true,
        });
    };
    drawerClose = () => {
        this.setState({
            drawerVisible: false,
        });
    };

    confirmStudy = () => {
        confirmStudy(this.state.order.id).then((result) => {
            this.showMessage(result);
            this.getOrder(this.state.order.id);
        });
    };

    //展示评论框
    showCommentModal = () => {
        this.setState({
            commentVisible: true,
        });
    };

    //提交评论
    handleOk = () => {
        let comment = {
            content: this.state.comment,
            orderId: this.state.order.id,
            starLevel: this.state.starLevel,
        };
        console.log(comment);
        // addComment(comment).then((result) => {
        //     if (result.success === true) {
        //         message.success(result.msg);
        //         this.setState({
        //             visible2: false,
        //         }, () => {
        //             this.props.onDidMount(this.state.id);
        //         });
        //     } else {
        //         message.error(result.msg);
        //     }
        //
        // });
    };

    //取消展示评论框
    handleCancel = () => {
        this.setState({
            commentVisible: false,
            comment: '',
            starLevel: 0,
        });
    };

    //评论框改变
    textAreaChange = (e) => {
        this.setState({
            comment: e.target.value,
        });
    };

    //星级选择
    rateChange = (value) => {
        this.setState({
            starLevel: value,
        });
    };

    render() {
        const bottom = (
            this.state.order.courseOrderStatus === '待付款'
                ?
                <div>
                    <Button type={'primary'} onClick={() => this.pay()}>立即付款</Button>&nbsp;&nbsp;
                    <Button type={'danger'} onClick={() => this.closeOrder()}>取消订单</Button>
                </div>
                :
                this.state.order.courseOrderStatus === '待学习'
                    ?
                    <div>
                        <b style={{ fontSize: 20, color: 'black' }}>等待联系，或</b>&nbsp;&nbsp;
                        <Button type={'primary'} onClick={this.showDrawer}>主动联系</Button>
                    </div>
                    :
                    this.state.order.courseOrderStatus === '待确认结课'
                        ?
                        <div>
                            <Button type={'primary'} onClick={this.confirmStudy}>确认结课</Button>
                        </div>
                        :
                        this.state.order.courseOrderStatus === '待评价'
                            ?
                            <div>
                                <Button type={'primary'} onClick={this.showCommentModal}>立即评价</Button>
                            </div>
                            :
                            this.state.order.courseOrderStatus === '已关闭'
                                ?
                                <b style={{ fontSize: 20, color: 'black' }}>您已关闭该订单</b>
                                :
                                <b style={{ fontSize: 20, color: 'green' }}>您已完成该订单</b>

        );
        return (
            <div style={{ paddingLeft: 150, paddingRight: 150 }}>
                <h1>订单详情</h1>
                <div className={styles.pay} style={{ padding: 20 }}>
                    <h3>订单编号：{this.state.order.id}</h3>
                    <Row style={{ paddingBottom: 10 }}>
                        <Col span={12} style={{ height: 20 }}>
                            <h3>课程信息</h3>
                        </Col>
                    </Row>
                    <div>
                        <Row className={styles.info}
                             style={{ height: 100, background: '#EEEEEE' }}
                             type="flex" justify="space-around" align="middle"
                        >
                            <Col offset={1} span={7}>
                                <img style={{ width: 80, height: 60 }}
                                     alt=''
                                     src={this.state.order.courseVO.mainImageUrl}
                                />
                            </Col>
                            <Col span={4}>{this.state.order.courseVO.courseName}</Col>
                            <Col offset={3} span={3}>
                                <h3>￥{this.state.order.courseVO.courseDiscountPrice}</h3>
                            </Col>
                            <Col span={3}>
                                <Button onClick={() => {
                                    router.push({
                                        pathname: 'courseDetails',
                                        query: {
                                            courseId: this.state.order.courseVO.id,
                                        },
                                    });
                                }}>商品详情</Button>
                            </Col>
                        </Row>
                        <Divider/>
                    </div>
                    <Row>
                        <div>
                            <Row gutter={30}>
                                <Col offset={10} span={2}>
                                    <div style={{ textAlign: 'center' }}>
                                        <b style={{ fontSize: 20, color: 'red' }}>￥{this.state.order.dealPrice}</b>
                                    </div>

                                </Col>
                                <Col span={4}>
                                    <div style={{ textAlign: 'center' }}>
                                        <b style={{
                                            fontSize: 20,
                                            color: 'blue',
                                        }}>{this.state.order.courseOrderStatus}</b>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{ textAlign: 'center' }}>
                                        {bottom}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Row>

                </div>
                <Modal
                    style={{ top: 20 }}
                    width='60%'
                    title={<img alt='' src='https://t.alipayobjects.com/images/T1HHFgXXVeXXXXXXXX.png'/>}
                    visible={this.state.visible}
                    onOk={this.handlePayOk}
                    onCancel={this.payCancel}
                >
                    <div style={{
                        height: 440,
                        overflow: 'hidden',
                    }}>
                        <iframe
                            title='支付宝'
                            style={{ width: '100%', border: '0px', height: 600, marginTop: -170, marginLeft: -10 }}
                            sandbox="allow-scripts allow-forms allow-same-origin"
                            scrolling="no"
                            src={this.state.html}
                        />
                    </div>
                </Modal>
                <Drawer
                    title="联系方式"
                    placement="right"
                    closable={false}
                    onClose={this.drawerClose}
                    visible={this.state.drawerVisible}
                >
                    <p>手机：{this.state.order.teacherName}</p>
                    <p>姓名：{this.state.order.teacherName}</p>
                    <p>地点：{this.state.order.coursePlace}</p>
                </Drawer>
                <Modal
                    title="添加评价"
                    visible={this.state.commentVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    destroyOnClose
                >
                    <TextArea rows={4} defaultValue={this.state.comment}
                              onChange={this.textAreaChange}/>
                    您对这次订单的满意程度：<Rate defaultValue={this.state.starLevel}
                                      onChange={this.rateChange}/>
                </Modal>
            </div>
        );
    }
};

export default CourseOrderInfo;
