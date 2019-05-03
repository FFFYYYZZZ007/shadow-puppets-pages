import React from 'react';
import styles from './css/order.css';
import { Row, Col, Card, Button, Divider, Tabs, message, Pagination, Modal, Input, Rate } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { cancelGoodsOrderById, confirmReceipt } from '../services/GoodsOrderService';
import { addComment } from '@/services/CommentService';

const TabPane = Tabs.TabPane;
const namespace = 'goodsOrder';
const { TextArea } = Input;

const mapStateToProps = (state) => {
    const goodsOrderList = state[namespace].list;
    console.log(goodsOrderList);
    return {
        goodsOrderList,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onDidMount: (orderQO) => {
            const action = {
                type: `${namespace}/getGoodsOrderList`,
                payload: orderQO,
            };
            dispatch(action);
        },
    };
};

@connect(mapStateToProps, mapDispatchToProps)
class order extends React.Component {
    //
    // componentWillUpdate() {
    //     document.getElementById('root').scrollIntoView(true);//为ture返回顶部，false为底部
    // };

    constructor(props) {
        super(props);
        this.state = {
            tabKey: -1,
            page: 1,
            pageSize: 5,
            visible: false,
            comment: '',
            operateOrderId: '',
            starLevel: 0,
        };
    }

    componentDidMount() {
        this.onChange();
    }

    onChange() {
        let orderQO = {
            tabKey: this.state.tabKey,
            page: this.state.page,
            pageSize: this.state.pageSize,

        };
        console.log('===');
        console.log(orderQO);
        this.props.onDidMount(orderQO);
    }

    orderInfo(orderId) {
        router.push({
            pathname: '/orderInfo',
            query: {
                orderId: orderId,
            },
        });
    }

    deleteOrder(orderId) {
        console.log(orderId);
        cancelGoodsOrderById(orderId).then((result) => {
            if (result.success === true) {
                message.success(result.msg);
                this.onChange();
            } else {
                message.error(result.msg);
            }
        });
    }

    //tab标签切换调用方法
    callback(key) {
        console.log(key);
        this.setState({ tabKey: key }, () => this.onChange());
    }

    //页码改变调用方法
    pageChange = (page) => {
        console.log(page);
        this.setState({
            page: page,
        }, () => this.onChange());

    };

    //展示评论框
    showModal(orderId) {
        this.setState({
            visible: true,
            operateOrderId: orderId,
        });
    };

    //提交评论
    handleOk = () => {
        let comment = {
            content: this.state.comment,
            orderId: this.state.operateOrderId,
            starLevel: this.state.starLevel,
        };
        console.log(comment);
        addComment(comment).then((result) => {
            if (result.success === true) {
                message.success(result.msg);
                this.setState({
                    visible: false,
                    tabKey: 3,
                }, () => {
                    this.onChange();
                });
            } else {
                message.error(result.msg);
            }

        });

    };

    //取消展示评论框
    handleCancel = () => {
        this.setState({
            visible: false,
            comment: '',
            operateOrderId: '',
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

    confirmReceipt = (orderId) => {
        confirmReceipt(orderId).then((result) => {
            message.success(result.msg);
            this.onChange();
        });
    };

    render() {
        return (
            <div style={{ paddingLeft: 150, paddingRight: 150 }}>
                <Row gutter={16}>
                    <Col span={4}>
                        <Row span={6} style={{ height: 30, paddingBottom: 30 }}><h1>我的订单</h1></Row>
                        <Tabs tabPosition={'left'} defaultActiveKey="-1" onChange={(e) => this.callback(e)}>
                            <TabPane tab="全部" key="-1"/>
                            <TabPane tab="待付款" key="0"/>
                            <TabPane tab="待发货" key="1"/>
                            <TabPane tab="待收货" key="2"/>
                            <TabPane tab="待评价" key="3"/>
                            <TabPane tab="已完成" key="4"/>
                            <TabPane tab="已关闭" key="5"/>
                        </Tabs>
                    </Col>
                    <Col span={20}>

                        {this.props.goodsOrderList !== undefined && this.props.goodsOrderList.list !== undefined && this.props.goodsOrderList.list.length !== 0 ?
                            this.props.goodsOrderList.list.map(order => {
                                return (
                                    <div key={order.id}>
                                        <Card className={styles.card}
                                              title={'订单编号：' + order.id}
                                              extra={
                                                  order.status === '已完成' || order.status === '已关闭'
                                                      ?
                                                      [
                                                          <font key={'status'} size={2}
                                                                color='green'>{order.status}&nbsp;&nbsp;&nbsp;&nbsp;</font>,
                                                          <Button key={'orderInfo' + order.id}
                                                                  type='primary'
                                                                  onClick={() => this.orderInfo(order.id)}>查看详情</Button>,

                                                      ]
                                                      :
                                                      (order.status === '待付款' ?
                                                              [
                                                                  <font key={'status'} size={2}
                                                                        color='green'>{order.status}&nbsp;&nbsp;&nbsp;&nbsp;</font>,
                                                                  <Button key={'pay' + order.id} type='primary'
                                                                          onClick={() => this.orderInfo(order.id)}>立即支付</Button>,
                                                                  <font key={'kg' + order.id}>&nbsp;&nbsp;</font>,
                                                                  <Button key={'cancle' + order.id}
                                                                          onClick={() => this.deleteOrder(order.id)}>取消订单</Button>,
                                                                  <font key={'kg2' + order.id}>&nbsp;&nbsp;</font>,
                                                                  <Button key={'orderInfo' + order.id}
                                                                          type='primary'
                                                                          onClick={() => this.orderInfo(order.id)}>查看详情</Button>,
                                                              ]
                                                              :
                                                              (order.status === '待评价' ?
                                                                      [
                                                                          <font key={'status'} size={2}
                                                                                color='green'>{order.status}&nbsp;&nbsp;&nbsp;&nbsp;</font>,
                                                                          <Button key={'orderInfo' + order.id}
                                                                                  type='primary'
                                                                                  onClick={() => this.orderInfo(order.id)}>查看详情</Button>,
                                                                          <font
                                                                              key={'kg2' + order.id}>&nbsp;&nbsp;</font>,
                                                                          <Button key={'pj' + order.id} type='primary'
                                                                                  onClick={() => this.showModal(order.id)}
                                                                          >
                                                                              添加评价</Button>,
                                                                      ] : (order.status === '待收货' ?
                                                                          [
                                                                              <font key={'status'} size={2}
                                                                                    color='green'>{order.status}&nbsp;&nbsp;&nbsp;&nbsp;</font>,
                                                                              <Button key={'orderInfo' + order.id}
                                                                                      type='primary'
                                                                                      onClick={() => this.orderInfo(order.id)}>查看详情</Button>,
                                                                              <font
                                                                                  key={'kg2' + order.id}>&nbsp;&nbsp;</font>,
                                                                              <Button key={'pj' + order.id}
                                                                                      type='primary'
                                                                                      onClick={() => this.confirmReceipt(order.id)}
                                                                              >
                                                                                  确认收货</Button>,
                                                                          ]
                                                                          :
                                                                          [
                                                                              <font key={'status'} size={2}
                                                                                    color='green'>{order.status}&nbsp;&nbsp;&nbsp;&nbsp;</font>,
                                                                              <Button key={'orderInfo' + order.id}
                                                                                      type='primary'
                                                                                      onClick={() => this.orderInfo(order.id)}>查看详情</Button>,
                                                                          ])
                                                              )
                                                      )
                                              }
                                        >
                                            {order.goodsVOList.map(goodsVO => {
                                                return (
                                                    <div key={goodsVO.id + goodsVO.goodsName}>
                                                        <Row className={styles.card}
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
                                            运费：{order.expressFee}元，商品总价：{order.dealPrice}元，订单总价：{order.dealPrice + order.expressFee} 元。
                                        </Card>
                                        <Divider></Divider>
                                        <Modal
                                            title="添加评价"
                                            visible={this.state.visible}
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
                            })
                            :
                            <div style={{ textAlign: 'center' }}>
                                <font key={'noOrder'} size={2}>暂无相应订单&nbsp;&nbsp;&nbsp;&nbsp;</font>
                            </div>
                        }
                    </Col>
                </Row>
                <Row><Col offset={16}><Pagination
                    hideOnSinglePage={true}
                    pageSize={this.state.pageSize}
                    defaultCurrent={1}
                    total={this.props.goodsOrderList.total}
                    onChange={this.pageChange}/></Col></Row>
            </div>
        );
    }

}

export default order;
