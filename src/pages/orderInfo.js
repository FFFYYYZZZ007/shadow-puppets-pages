import React from 'react'
import styles from './css/pay.css';
import { Row, Col, Button, Divider, message, Modal } from 'antd';
import { connect } from "dva";
import { getAliPayUrl, checkTradeStatus, cancelGoodsOrderById } from '../services/GoodsOrderService'
import router from 'umi/router';

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
                payload: id
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
        super(props)
        let url = window.location.href
        let split = url.split('=')
        let id = split[1]
        this.props.onDidMount(id);
        this.state = {
            loading: false,
            id: id,
            html: '',
            visible: false,
        }
    }

    pay = () => {
        this.setState({ loading: true });
        console.log(this.state.id);
        getAliPayUrl(this.state.id).then((result) => {
            this.setState({ loading: false });
            console.log(result.data);
            this.setState({ html: result.data })
            this.showModal();
            this.checkStatus();
        });
    }

    checkStatus = () => {
        console.log(this.state.visible)

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
        })
        setTimeout(() => this.checkStatus(), 2000);
    }



    cancel = () => {
        this.setState({ loading: true });
        cancelGoodsOrderById(this.state.id).then((result) => {
            if (result.success === true) {
                message.success(result.msg);
                router.push('/order');
            } else {
                message.error(result.msg);
            }
        })
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    render() {

        const bottom = (
            this.props.goodsOrder.status === '已关闭' || this.props.goodsOrder.status === '已完成' ? <font key={'status'} size={2} color='green'>订单{this.props.goodsOrder.status}</font>
                : (
                    this.props.goodsOrder.status === '已支付'
                        ?
                        <div>
                            <font key={'status'} size={2} color='green'>订单{this.props.goodsOrder.status}&nbsp;&nbsp;&nbsp;&nbsp;</font>
                        </div>
                        :
                        <div>
                            <Button type='primary' loading={this.state.loading} onClick={this.pay}>确认支付</Button>&nbsp;&nbsp;
                            <Button type='danger' loading={this.state.loading} onClick={this.cancel}>取消订单</Button>
                        </div>
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
                                        <Col span={6} />
                                        <Col span={3}>
                                            <h3 >￥{goodsVO.price}</h3>
                                        </Col>
                                        <Col span={3} >
                                            <h3 >{goodsVO.num}个</h3>
                                        </Col>
                                    </Row>
                                    <Divider />
                                </div>
                            );
                        })}
                    <Row>
                        <div style={{ float: 'right' }}>
                            <div>
                                运费：{this.props.goodsOrder.expressFee}元，商品总价：{this.props.goodsOrder.dealPrice}元，{this.props.goodsOrder.status === '未支付' ? '未支付' : '已支付'}：{this.props.goodsOrder.dealPrice + this.props.goodsOrder.expressFee} 元。
                            </div>
                            <Col offset={10}>{bottom}</Col>
                        </div>
                    </Row>

                    <Modal
                        style={{ top: 20 }}
                        width='60%'
                        title={<img alt='' src='https://t.alipayobjects.com/images/T1HHFgXXVeXXXXXXXX.png' />}
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >

                        <div style={{
                            height: 440,
                            overflow: 'hidden'
                        }}>
                            <iframe
                                title='支付宝'
                                style={{ width: '100%', border: '0px',height: 600, marginTop: -170, marginLeft: -10, }}
                                sandbox="allow-scripts allow-forms allow-same-origin"
                                scrolling="no"
                                src={this.state.html}
                            />
                        </div>

                    </Modal>
                </div>
            </div>
        );
    }
};

export default OrderInfo;
