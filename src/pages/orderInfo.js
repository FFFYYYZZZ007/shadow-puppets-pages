import React from 'react';
import styles from './css/pay.css';
import { Row, Col, Button, Divider, message, Modal, Rate, Input } from 'antd';
import { connect } from 'dva';
import { getAliPayUrl, checkTradeStatus, cancelGoodsOrderById } from '../services/GoodsOrderService';
import router from 'umi/router';
import order from '@/pages/order';
import { addComment } from '@/services/CommentService';

const { TextArea } = Input;
const namespace = 'goodsOrder';

const mapStateToProps = (state) => {
    const goodsOrder = state[namespace].goodsOrder;
    console.log(goodsOrder);
    return {
        goodsOrder,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDidMount: (id) => {
            if (id === undefined || id === '') {
                return;
            }
            const action = {
                type: `${namespace}/getOrderById`,
                payload: id,
            };
            dispatch(action);
        },
    };
};

@connect(mapStateToProps, mapDispatchToProps)
class OrderInfo extends React.Component {

    componentWillUpdate() {
        document.getElementById('root').scrollIntoView(true);//为ture返回顶部，false为底部
    };

    constructor(props) {
        super(props);
        let url = window.location.href;
        let split = url.split('=');
        let id = split[1];
        this.props.onDidMount(id);
        this.state = {
            loading: false,
            id: id,
            html: '',
            visible: false,
            visible2: false,
            comment: '',
            starLevel: 0,
        };
    }

    pay = () => {
        this.setState({ loading: true });
        console.log(this.state.id);
        getAliPayUrl(this.state.id).then((result) => {
            this.setState({ loading: false });
            console.log(result.data);
            this.setState({ html: result.data });
            this.showPayModal();
            this.checkStatus();
        });
    };

    checkStatus = () => {
        console.log(this.state.visible);

        if (this.state.visible === false) {
            return;
        }
        checkTradeStatus(this.state.id).then((result) => {
            if (result.success === true) {
                message.success(result.msg);
                this.setState({ visible: false });
                this.props.onDidMount(this.state.id);
                return;
            }
        });
        setTimeout(() => this.checkStatus(), 2000);
    };


    cancel = () => {
        this.setState({ loading: true });
        cancelGoodsOrderById(this.state.id).then((result) => {
            if (result.success === true) {
                message.success(result.msg);
                router.push('/order');
            } else {
                message.error(result.msg);
            }
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

    //展示评论框
    showModal(orderId) {
        this.setState({
            visible2: true,
        });
    };

    //提交评论
    handleOk = () => {
        let comment = {
            content: this.state.comment,
            orderId: this.state.id,
            starLevel: this.state.starLevel,
        };
        console.log(comment);
        addComment(comment).then((result) => {
            if (result.success === true) {
                message.success(result.msg);
                this.setState({
                    visible2: false,
                }, () => {
                    this.props.onDidMount(this.state.id);
                });
            } else {
                message.error(result.msg);
            }

        });

    };

    //取消展示评论框
    handleCancel = () => {
        this.setState({
            visible2: false,
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
            this.props.goodsOrder.status === '已关闭' || this.props.goodsOrder.status === '已完成' ?
                <font key={'status'} size={2} color='green'>订单{this.props.goodsOrder.status}</font>
                : (
                    this.props.goodsOrder.status === '已支付'
                        ?
                        <div>
                            <font key={'status'} size={2}
                                  color='green'>订单{this.props.goodsOrder.status}&nbsp;&nbsp;&nbsp;&nbsp;</font>
                        </div>
                        :
                        (this.props.goodsOrder.status === '待评价'
                                ?
                                <div>
                                    <font key={'status'} size={2}
                                          color='green'>订单{this.props.goodsOrder.status}&nbsp;&nbsp;&nbsp;&nbsp;</font>
                                    <Button key={'pj' + order.id} type='primary'
                                            onClick={() => this.showModal(order.id)}
                                    >
                                        添加评价</Button>
                                </div>
                                :
                                <div>
                                    <Button type='primary' loading={this.state.loading}
                                            onClick={this.pay}>确认支付</Button>&nbsp;&nbsp;
                                    <Button type='danger' loading={this.state.loading} onClick={this.cancel}>取消订单</Button>
                                </div>
                        )

                )
        );

        return (
            <div style={{ paddingLeft: 150, paddingRight: 150 }}>
                <h1>订单详情</h1>
                <div className={styles.pay} style={{ padding: 20 }}>
                    <Row style={{ paddingBottom: 10 }}>
                        <Col span={12} style={{ height: 20 }}>
                            <h3>商品信息</h3>
                        </Col>
                    </Row>
                    {this.props.goodsOrder.goodsVOList === undefined ? null :
                        this.props.goodsOrder.goodsVOList.map(goodsVO => {
                            return (
                                <div key={goodsVO.id}>
                                    <Row className={styles.info}
                                         style={{ height: 150, background: '#EEEEEE' }}
                                         type="flex" justify="space-around" align="middle"
                                    >
                                        <Col offset={1} span={7}>
                                            <img style={{ width: 160, height: 120 }}
                                                 alt=''
                                                 src={goodsVO.mainImageUrl}
                                            />
                                        </Col>
                                        <Col span={4}>{goodsVO.goodsName}</Col>
                                        <Col span={6}/>
                                        <Col span={3}>
                                            <h3>￥{goodsVO.price}</h3>
                                        </Col>
                                        <Col span={3}>
                                            <h3>{goodsVO.num}个</h3>
                                        </Col>
                                    </Row>
                                    <Divider/>
                                </div>
                            );
                        })}
                    <Row>
                        <div style={{ float: 'right' }}>
                            <div>
                                运费：{this.props.goodsOrder.expressFee}元，商品总价：{this.props.goodsOrder.dealPrice}元，{this.props.goodsOrder.status === '未支付' ? '未支付' : '已支付'}：{this.props.goodsOrder.dealPrice + this.props.goodsOrder.expressFee} 元。
                            </div>
                            <Col offset={8}>{bottom}</Col>
                        </div>
                    </Row>

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

                    <Modal
                        title="添加评价"
                        visible={this.state.visible2}
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
            </div>
        );
    }
};

export default OrderInfo;
