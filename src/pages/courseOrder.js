import React from 'react';
import {
    Row,
    Col,
    Tabs,
    Pagination,
    Divider,
    Card,
    Spin,
    Button,
    Popconfirm,
    message,
    Drawer,
    Rate,
    Modal, Input,
} from 'antd';
import { closeOrder, confirmStudy, getCourseOrderList } from '@/services/CourseService';
import styles from '@/pages/css/order.css';
import router from 'umi/router';
import { addComment } from '@/services/CourseCommentService';

const { TextArea } = Input;
const TabPane = Tabs.TabPane;

class courseOrder extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            tabKey: -1,
            page: 1,
            pageSize: 5,
            total: 0,
            visible: false,
            orderList: [],
            spinning: false,
            drawerVisible: false,
            commentVisible: false,

            orderId:'',
            comment: '',
            starLevel: 0,
        };
    }

    componentDidMount() {
        document.getElementById('root').scrollIntoView(true);
        this.reloadOrder();
    }

    reloadOrder() {
        let courseOrderQO = {
            pageNum: this.state.page,
            pageSize: this.state.pageSize,
            courseOrderStatus: this.state.tabKey,
        };
        console.log(courseOrderQO);
        this.setState({ spinning: true });
        getCourseOrderList(courseOrderQO).then((result) => {
            console.log(result);
            this.setState({
                orderList: result.data.list,
                total: result.data.total,
                spinning: false,
            });
        });
    }

    //tab标签切换调用方法
    callback(key) {
        console.log(key);
        this.setState({ tabKey: key }, () => this.reloadOrder());
    }

    //页码改变调用方法
    pageChange = (page) => {
        console.log(page);
        this.setState({
            page: page,
        }, () => this.reloadOrder());

    };

    showMessage(result) {
        if (result.success === true) {
            message.success(result.msg, 1);
        } else {
            message.error(result.msg, 1);
        }
    }

    render() {
        return (
            <div style={{ paddingLeft: 150, paddingRight: 150 }}>
                <Row gutter={16}>
                    <Col span={4}>
                        <Row span={6} style={{ height: 30, paddingBottom: 30 }}><h1>我的课程订单</h1></Row>
                        <Tabs tabPosition={'left'} defaultActiveKey="-1" onChange={(e) => this.callback(e)}>
                            <TabPane tab="全部" key="-1"/>
                            <TabPane tab="待付款" key="0"/>
                            <TabPane tab="待学习" key="1"/>
                            <TabPane tab="待确认结课" key="2"/>
                            <TabPane tab="待评价" key="3"/>
                            <TabPane tab="已完成" key="4"/>
                            <TabPane tab="已关闭" key="5"/>
                        </Tabs>
                    </Col>
                    <Col offset={1} span={19}>
                        <Spin spinning={this.state.spinning}>
                            {this.state.orderList.length === 0
                                ?
                                <h1>
                                    <center>暂无相应订单</center>
                                </h1>
                                :
                                this.state.orderList.map((order) => {
                                    return (
                                        <div key={'order'+order.id}>
                                            <Card className={styles.card}
                                                  hoverable={true}
                                                  title={'订单编号：' + order.id}
                                                  key={'order1'+order.id}
                                                  extra={
                                                      [
                                                          <b style={{ fontSize: 20 }} key={'bKey'}>{order.courseOrderStatus}&nbsp;&nbsp;&nbsp;</b>,
                                                          <Button key={'buttonKey'} onClick={() => {
                                                              router.push({
                                                                  pathname: 'courseDetails',
                                                                  query: {
                                                                      courseId: order.courseVO.id,
                                                                  },
                                                              });
                                                          }}>商品详情</Button>,
                                                      ]
                                                  }
                                            >

                                                <div key={order.courseVO.id + order.courseVO.courseName}>
                                                    <Row className={styles.card}
                                                         style={{ height: 150, background: '#EEEEEE' }}
                                                         type="flex" justify="space-around" align="middle"
                                                    >
                                                        <Col offset={1} span={7}>
                                                            <img style={{ width: 160, height: 120 }}
                                                                 alt=''
                                                                 src={order.courseVO.mainImageUrl}
                                                            />
                                                        </Col>
                                                        <Col span={4}>{order.courseVO.courseName}</Col>
                                                        <Col offset={1} span={3}>
                                                            <h3>￥{order.courseVO.courseDiscountPrice}</h3>
                                                        </Col>
                                                        <Col span={3}>
                                                            <Button onClick={() => {
                                                                router.push({
                                                                    pathname: 'courseDetails',
                                                                    query: {
                                                                        courseId: order.courseVO.id,
                                                                    },
                                                                });
                                                            }}>商品详情</Button>
                                                        </Col>
                                                        <Col span={3}/>
                                                    </Row>
                                                    <Divider/>
                                                </div>
                                                <font key={'order3'+order.id}
                                                      style={{ fontSize: 20 }}>订单总价：&nbsp;&nbsp;{order.dealPrice} 元</font>
                                                {order.courseOrderStatus === '待付款' ?
                                                    <div style={{ float: 'right' }}>
                                                        <Button type={'primary'}
                                                                onClick={() => {
                                                                    router.push({
                                                                        pathname: 'courseOrderInfo',
                                                                        query: {
                                                                            orderId: order.id,
                                                                        },
                                                                    });
                                                                }}>去付款</Button>&nbsp;&nbsp;&nbsp;
                                                        <Popconfirm title="确定取消？"
                                                                    onConfirm={() => {
                                                                        closeOrder(order.id).then((result) => {
                                                                            this.showMessage(result);
                                                                            this.reloadOrder();
                                                                        });
                                                                    }}
                                                                    okText="确定"
                                                                    cancelText="不确定">
                                                            <Button type={'danger'}>取消订单</Button>
                                                        </Popconfirm>
                                                    </div>
                                                    : null}
                                                {order.courseOrderStatus === '待学习' ?
                                                    <div style={{ float: 'right' }}>
                                                        <Button type={'primary'} onClick={() => {
                                                            this.setState({
                                                                drawerVisible: true,
                                                            });
                                                        }}>联系老师</Button>
                                                    </div>
                                                    : null}
                                                {order.courseOrderStatus === '待确认结课' ?
                                                    <div style={{ float: 'right' }}>
                                                        <Button type={'primary'} onClick={() => {
                                                            confirmStudy(order.id).then((result) => {
                                                                this.showMessage(result);
                                                                this.reloadOrder();
                                                            });
                                                        }}>确认结课</Button>
                                                    </div>
                                                    : null}
                                                {order.courseOrderStatus === '待评价' ?
                                                    <div style={{ float: 'right' }}>
                                                        <Button type={'primary'} onClick={() => {
                                                            this.setState({
                                                                commentVisible: true,
                                                                orderId:order.id
                                                            });
                                                        }}>立即评价</Button>
                                                    </div>
                                                    : null}
                                                {order.courseOrderStatus === '已完成' || order.courseOrderStatus === '已关闭' ?
                                                    <div style={{ float: 'right' }}>
                                                        <b style={{
                                                            fontSize: 20,
                                                            color: 'green',
                                                        }}>订单{order.courseOrderStatus}</b>
                                                    </div>
                                                    : null}
                                            </Card>
                                            <Divider />
                                            <div >
                                                <Drawer
                                                    title="联系方式"
                                                    placement="right"
                                                    closable={false}
                                                    onClose={() => {
                                                        this.setState({ drawerVisible: false });
                                                    }}
                                                    visible={this.state.drawerVisible}
                                                >
                                                    <p>手机：{order.courseVO.teacherName}</p>
                                                    <p>姓名：{order.courseVO.teacherName}</p>
                                                    <p>地点：{order.courseVO.coursePlace}</p>
                                                </Drawer>
                                            </div>

                                        </div>
                                    );
                                })
                            }
                        </Spin>
                    </Col>
                </Row>
                <Row>
                    <Col offset={16}>
                        <Pagination
                            hideOnSinglePage={true}
                            pageSize={this.state.pageSize}
                            defaultCurrent={1}
                            total={this.state.total}
                            onChange={this.pageChange}/>
                    </Col>
                </Row>
                <div>
                    <Modal
                        title="添加评价"
                        okText='评价'
                        cancelText='取消'
                        destroyOnClose
                        visible={this.state.commentVisible}
                        onOk={() => {
                            let comment = {
                                content: this.state.comment,
                                orderId: this.state.orderId,
                                starLevel: this.state.starLevel,
                            };
                            console.log(comment);
                            //add评论
                            addComment(comment).then((result) => {
                                if (result.success === true) {
                                    message.success(result.msg);
                                    this.setState({
                                        commentVisible: false,
                                    }, () => {
                                        this.reloadOrder();
                                    });
                                } else {
                                    message.error(result.msg);
                                }

                            });
                        }}
                        onCancel={() => {
                            this.setState({
                                commentVisible: false,
                                comment: '',
                                starLevel: 0,
                            });
                        }}
                    >
                        <TextArea rows={4}
                                  defaultValue={this.state.comment}
                                  onChange={(e) => {
                                      this.setState({
                                          comment: e.target.value,
                                      });
                                  }}/>
                        您对这次课程的满意程度：
                        <Rate defaultValue={this.state.starLevel}
                              onChange={(value) => {
                                  this.setState({
                                      starLevel: value,
                                  });
                              }}/>
                    </Modal>
                </div>
            </div>
        );
    }

}

export default courseOrder;
