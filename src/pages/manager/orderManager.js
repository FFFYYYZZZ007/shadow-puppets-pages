import React from 'react';
import {
    Table, Card, Row, Icon, Col, Divider, Button,
} from 'antd';
import styles from '../css/order.css';
import { getOrderListByManager } from '../../services/GoodsOrderService';
import router from 'umi/router';

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

class CategoryManager extends React.Component {

    componentWillUpdate() {
        document.getElementById('root').scrollIntoView(true);//为ture返回顶部，false为底部
    }

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
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
                    return (
                        (record.status === '已支付'
                                ?
                                <Button>查看</Button>
                                :
                                (
                                    record.status === '未支付'
                                        ?
                                        <p>暂无</p>
                                        :
                                        <p>已送达</p>
                                )
                        )
                    );
                },
            },
        ];
    }

    componentDidMount() {
        this.changeGoodsOrderList();
    }

    changeGoodsOrderList() {
        this.setState({
            loading: true,
        });
        getOrderListByManager({}).then((result) => {
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
            });
            console.log(this.state.data);
        });
    }

    changeLoading() {
        this.setState({ loading: this.state.loading ? false : true });
    }

    render() {

        function jump2DetailsPage(goodsId) {
            router.push('/goodsDetails?' + goodsId);
        }

        return (
            <React.Fragment>
                <div style={{ background: '#fff' }}>
                    <Card bordered={false}>
                        <Row type="flex" justify="space-around" align="middle">
                            <font size={3}>订单管理</font>
                        </Row>
                    </Card>
                </div>
                <div style={{ height: 30 }}></div>
                <div style={{ background: '#fff' }}>
                    <div style={{ padding: 24 }}>

                        <Table
                            loading={this.state.loading}
                            bordered
                            expandIcon={CustomExpandIcon}
                            dataSource={this.state.data}
                            columns={this.columns}
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
                </div>
            </React.Fragment>
        );
    }
}

export default CategoryManager;
