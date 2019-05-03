import React from 'react';
import {
    Table, Card, Row, Icon, Col, Divider, Button, Input, Select, Modal,
} from 'antd';
import styles from '../css/order.css';
import { getOrderListByManager } from '../../services/GoodsOrderService';
import router from 'umi/router';
import { getOne } from '@/services/ExpressService';

const Option = Select.Option;

function CustomExpandIcon(props) {
    let text;
    if (props.expanded) {
        text = 'minus-circle';
    } else {
        text = 'plus-circle';
    }
    return (
        <Icon type={text} theme="twoTone" onClick={e => props.onExpand(props.record, e)}/>
    );
}

class orderManager extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,

            visible: false,

            orderId: '',
            orderStatus: -1,

            expressDeliveryVO: {},

            pagination: {
                current: 1,
                pageSize: 8,
                total: 0,
            },
        };
        this.columns = [
            { title: '订单编号', dataIndex: 'id', width: '10%' },
            { title: '用户', dataIndex: 'userName', width: '10%' },
            { title: '商品总价/元', dataIndex: 'dealPrice', width: '11%' },
            { title: '快递费/元', dataIndex: 'expressFee', width: '10%' },
            { title: '订单状态', dataIndex: 'status', width: '10%' },
            { title: '创建时间', dataIndex: 'dateCreate', width: '20%' },
            { title: '最近修改时间', dataIndex: 'dateUpdate', width: '20%' },
            {
                title: '物流状态', dataIndex: 'deliveryStatus', width: '10%', render: (text, record) => {
                    return (<Button onClick={() => this.showModal(record.id)}>查看</Button>);
                },
            },
        ];
    }

    componentDidMount() {
        document.getElementById('root').scrollIntoView(true);//为true返回顶部，false为底部
        this.changeGoodsOrderList();
    }

    changeGoodsOrderList() {
        this.setState({
            loading: true,
        });

        let orderListQO = {
            pageNum: this.state.pagination.current,
            pageSize: this.state.pagination.pageSize,
            orderId: this.state.orderId,
            status: this.state.orderStatus,
        };

        getOrderListByManager(orderListQO).then((result) => {
            this.changeLoading();
            let data = [];
            result.data.list.map((order) => {
                data.push({
                    key: order.id,
                    id: order.id,
                    userName: order.userName,
                    dealPrice: order.dealPrice,
                    expressFee: order.expressFee,
                    status: order.status,
                    dateCreate: order.dateCreate,
                    dateUpdate: order.dateUpdate,
                    goodsVOList: order.goodsVOList,
                });
                return null;
            });
            this.setState({
                data: data,
                pagination: {
                    current: result.data.pageNum,
                    pageSize: result.data.pageSize,
                    total: result.data.total,
                },
            });
            console.log(this.state.data);
        });
    }

    changeLoading() {
        this.setState({ loading: !this.state.loading });
    }

    pageChange(pageNum) {
        const pageInfo = { ...this.state.pagination };
        pageInfo.current = pageNum;
        this.setState({
            pagination: pageInfo,
        }, () => {
            this.changeGoodsOrderList();
        });
    }

    orderKeywordChange(e) {
        this.setState({
            orderId: e.target.value,
        });
    }

    orderStatusChange = (value) => {
        this.setState({
            orderStatus: value,
        });
    };

    showModal = (orderId) => {
        getOne(orderId).then((result) => {
            console.log(result.data);
            this.setState({
                expressDeliveryVO: result.data,
                visible: true,
            });
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
            expressDeliveryVO: {},
        });
    };


    render() {

        const paginationProps = {
            ...this.state.pagination,
            onChange: (current) => this.pageChange(current),
        };

        function jump2DetailsPage(goodsId) {
            router.push('/goodsDetails?' + goodsId);
        }

        return (
            <React.Fragment>
                <div style={{ background: '#fff' }}>
                    <Card bordered={false}>
                        <Row type="flex" justify="space-around" align="middle">
                            <font size={3}>商品订单</font>
                        </Row>
                    </Card>
                </div>
                <div style={{ height: 30 }}/>
                <div style={{ background: '#fff' }}>
                    <div style={{ padding: 24 }}>

                        <div style={{ paddingBottom: 24 }}>
                            <Input style={{ width: 150 }} placeholder="订单编号" onChange={e => this.orderKeywordChange(e)}
                                   allowClear/>&nbsp;&nbsp;&nbsp;
                            <Select style={{ width: 100 }} placeholder='状态' allowClear
                                    onChange={this.orderStatusChange}>
                                <Option value="0" key={0}>待付款</Option>
                                <Option value="1" key={1}>待发货</Option>
                                <Option value="2" key={2}>待收货</Option>
                                <Option value="3" key={3}>待评价</Option>
                                <Option value="4" key={4}>已完成</Option>
                                <Option value="5" key={5}>已关闭</Option>
                            </Select>&nbsp;&nbsp;&nbsp;
                            <Button type='primary' onClick={() => this.changeGoodsOrderList()}>搜索</Button>
                        </div>

                        <Table
                            loading={this.state.loading}
                            bordered
                            expandIcon={CustomExpandIcon}
                            dataSource={this.state.data}
                            columns={this.columns}
                            pagination={paginationProps}
                            expandedRowRender={record =>
                                <div>
                                    {record.goodsVOList.map(function(goodsVO) {
                                        return <div key={record.id + record.userName + goodsVO.id}>
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
                                                <Col offset={3} span={3}>
                                                    <h3>￥{goodsVO.price}</h3>
                                                </Col>
                                                <Col span={3}>
                                                    <h3>{goodsVO.num}个</h3>
                                                </Col>
                                                <Col span={3}>
                                                    <Button onClick={() => jump2DetailsPage(goodsVO.id)}>商品详情页</Button>
                                                </Col>
                                            </Row>
                                            <Divider/>
                                        </div>;
                                    })}
                                </div>}
                        />
                    </div>
                    <Modal
                        title="物流状态"
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        footer={[]}
                    >
                        <div style={{ fontSize: 18 }}>
                            <span>快递单号：  </span>{this.state.expressDeliveryVO.expressCode}<br/><br/>
                            <span>快递商家：  </span>{this.state.expressDeliveryVO.expressCarrier}<br/><br/>
                            <span>物流状态：  </span>{this.state.expressDeliveryVO.deliveryStatus}<br/><br/>
                            <span>发货时间：  </span>{this.state.expressDeliveryVO.dateExpressStart}<br/><br/>
                            <span>送达时间：  </span>{this.state.expressDeliveryVO.dateExpressEnd}<br/>
                        </div>
                    </Modal>
                </div>
            </React.Fragment>
        );
    }
}

export default orderManager;
